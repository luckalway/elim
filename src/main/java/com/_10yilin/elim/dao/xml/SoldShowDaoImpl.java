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
import com._10yilin.elim.entity.SoldShow;
import com._10yilin.elim.util.XmlUtils;

public class SoldShowDaoImpl implements SaleShowDao {

	private File rootFolder = null;
	private String BASE_FOLDER = Constants.PROJECT_HOME + "app/data/sold-show";
	private String BASE_URL = Constants.BASE_URL + "/" + "app/data/sold-show";

	public SoldShowDaoImpl() {
		rootFolder = new File(BASE_FOLDER);
	}

	public List<SoldShow> getAllSaleShowList() {
		List<SoldShow> soldshows = new ArrayList<SoldShow>();
		SAXBuilder builder = new SAXBuilder();
		for (File folder : rootFolder.listFiles()) {
			SoldShow saleShow = new SoldShow();
			saleShow.setId(folder.getName());
			for (File imageFile : folder.listFiles()) {
				File xml = new File(folder, "item.xml");
				try {
					Document document = builder.build(xml);
					XmlUtils.convertDocumentToEntity(document, saleShow);
				} catch (JDOMException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}

				if (imageFile.getName().startsWith("p.")) {
					saleShow.setPreviewImage(toPath(folder, imageFile));
				} else {
					saleShow.setMoreImages(new ArrayList<String>());
					saleShow.getMoreImages().add(toPath(folder, imageFile));
				}
			}
			soldshows.add(saleShow);
		}
		return soldshows;
	}

	private String toPath(File folder, File imageFile) {
		return BASE_URL + "/" + folder.getName() + "/" + imageFile.getName();
	}
}
