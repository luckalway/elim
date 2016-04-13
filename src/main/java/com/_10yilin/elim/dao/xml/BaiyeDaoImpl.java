package com._10yilin.elim.dao.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.BaiyeDao;
import com._10yilin.elim.data.handler.CollectionDataHandler;
import com._10yilin.elim.entity.Baiye;
import com._10yilin.elim.util.XmlUtils;

public class BaiyeDaoImpl implements BaiyeDao {
	private static final Logger LOG = Logger.getLogger(CollectionDataHandler.class);
	private File rootFolder = null;
	private String BASE_FOLDER = Constants.PROJECT_HOME + "/app/data/baiye";
	private String BASE_URL = Constants.BASE_URL + "/app/data/baiye";

	public BaiyeDaoImpl() {
		this.rootFolder = new File(BASE_FOLDER);
	}

	public List<Baiye> getBaiyes() {
		List<Baiye> baiyes = new ArrayList<Baiye>();
		SAXBuilder builder = new SAXBuilder();
		try {
			for (File itemFolder : this.rootFolder.listFiles()) {
				Baiye baiye = new Baiye();
				File xmlFile = new File(itemFolder, "item.xml");
				if (!xmlFile.exists()) {
					throw new IllegalArgumentException("Please create item.xml for " + itemFolder.getAbsolutePath()
							+ " first");
				}
				Document document = builder.build(new FileInputStream(xmlFile));
				baiye.setId(itemFolder.getName());
				XmlUtils.convertDocumentToEntity(document, baiye);
				baiye.setPreviewImage(BASE_URL + "/" + itemFolder.getName() + "/preview.jpg");
				baiye.setGallery(getImages(itemFolder));

				baiyes.add(baiye);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return baiyes;
	}

	private List<String> getImages(File itemFolder) {
		List<String> images = new ArrayList<String>();
		for (String imageName : itemFolder.list()) {
			if (imageName.startsWith("preview") || !imageName.endsWith(".jpg"))
				continue;
			images.add(BASE_URL + "/" + itemFolder.getName() + "/" + imageName);
		}
		return images;
	}

}
