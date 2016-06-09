package com._10yilin.elim.dao.xml;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.SaleShowDao;
import com._10yilin.elim.dao.support.ImageFilenameFilter;
import com._10yilin.elim.entity.SoldShow;
import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class SoldShowDaoImpl implements SaleShowDao {

	private File rootFolder = null;
	private String BASE_FOLDER = Constants.BASE_DATA + "/sold-show";
	private String BASE_URL = Constants.BASE_URL + "/data/sold-show";

	public SoldShowDaoImpl() {
		rootFolder = new File(BASE_FOLDER);
	}

	public List<SoldShow> getAllSaleShowList() {
		List<SoldShow> soldshows = new ArrayList<SoldShow>();
		SAXBuilder builder = new SAXBuilder();
		for (File folder : rootFolder.listFiles()) {
			SoldShow saleShow = new SoldShow();
			saleShow.setId(folder.getName());
			File xml = new File(folder, "item.xml");
			try {
				Document document = builder.build(xml);
				XmlUtils.convertDocumentToEntity(document, saleShow);
				saleShow.setPreviewImage(BASE_URL + "/" + folder.getName() + "/preview.jpg");
				saleShow.setImages(getImages(folder));
			} catch (JDOMException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			soldshows.add(saleShow);
		}
		return soldshows;
	}

	private List<String> getImages(File folder) {
		List<String> images = new ArrayList<String>();
		for (File image : folder.listFiles(new ImageFilenameFilter())) {
			if (ImageUtils.isImage(image) && !image.getName().equals("preview.jpg")) {
				images.add(BASE_URL + "/" + folder.getName() + "/" + image.getName());
			}
		}

		return images;
	}

}
