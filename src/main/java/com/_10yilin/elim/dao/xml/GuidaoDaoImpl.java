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
import com._10yilin.elim.dao.GuidaoDao;
import com._10yilin.elim.dao.support.ImageFilenameFilter;
import com._10yilin.elim.entity.peijian.Guidao;
import com._10yilin.elim.util.XmlUtils;

public class GuidaoDaoImpl implements GuidaoDao {
	private File rootFolder = null;
	private String BASE_FOLDER = Constants.PROJECT_HOME + "/app/data/peijian/guidao";
	private String BASE_URL = Constants.BASE_URL + "/app/data/peijian/guidao";

	public GuidaoDaoImpl() {
		this.rootFolder = new File(BASE_FOLDER);
	}

	public List<Guidao> getGuidaos() {
		List<Guidao> guidaos = new ArrayList<Guidao>();
		SAXBuilder builder = new SAXBuilder();
		try {
			for (File item : rootFolder.listFiles()) {
				Guidao guidao = new Guidao();
				Document document = builder.build(new FileInputStream(new File(item, "item.xml")));
				guidao.setId(item.getName());
				XmlUtils.convertDocumentToEntity(document, guidao);
				guidao.setImages(getImages(item));
				guidaos.add(guidao);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return guidaos;
	}

	private List<String> getImages(File itemFile) {
		List<String> images = new ArrayList<String>();
		for (String image : itemFile.list(new ImageFilenameFilter())) {
			if (image.endsWith(".xml"))
				continue;
			images.add(BASE_URL + "/" + itemFile.getName() + "/" + image);
		}
		return images;
	}

}
