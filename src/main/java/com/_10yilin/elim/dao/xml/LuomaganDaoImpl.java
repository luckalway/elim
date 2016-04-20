package com._10yilin.elim.dao.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.LuomaganDao;
import com._10yilin.elim.entity.peijian.Luomagan;
import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class LuomaganDaoImpl implements LuomaganDao {
	private File rootFolder = null;
	private String BASE_FOLDER = Constants.PROJECT_HOME + "/app/data/peijian/luomagan";
	private String BASE_URL = Constants.BASE_URL + "/app/data/peijian/luomagan";

	public LuomaganDaoImpl() {
		this.rootFolder = new File(BASE_FOLDER);
	}

	public List<Luomagan> getLuomagans() {
		List<Luomagan> luomagans = new ArrayList<Luomagan>();
		SAXBuilder builder = new SAXBuilder();
		try {
			for (File itemFolder : this.rootFolder.listFiles()) {
				Luomagan luomagan = new Luomagan();
				Document document = builder.build(new FileInputStream(new File(itemFolder, "item.xml")));
				XmlUtils.convertDocumentToEntity(document, luomagan);
				luomagan.setId(itemFolder.getName());
				luomagan.setImages(getImages(itemFolder));
				luomagans.add(luomagan);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return luomagans;
	}

	private List<String> getImages(File itemFolder) {
		List<String> images = new ArrayList<String>();
		for (File image : itemFolder.listFiles()) {
			if (ImageUtils.isImage(image))
				images.add(BASE_URL + "/" + itemFolder.getName() + "/" + image.getName());
		}
		return images;
	}

}
