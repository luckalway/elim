package com._10yilin.elim.dao.xml;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.SaleShowDao;
import com._10yilin.elim.entity.SaleShow;

public class SoldShowDaoImpl implements SaleShowDao {

	private File rootFolder = null;
	private String BASE_FOLDER = Constants.PROJECT_HOME + File.separatorChar + Constants.FOLDER_SALE_SHOW_DATA;
	private String BASE_URL = Constants.BASE_URL + "/" + Constants.FOLDER_SALE_SHOW_DATA;

	public SoldShowDaoImpl() {
		rootFolder = new File(BASE_FOLDER);
	}

	public List<SaleShow> getAllSaleShowList() {
		List<SaleShow> saleshows = new ArrayList<SaleShow>();
		SAXBuilder builder = new SAXBuilder();
		for (File folder : rootFolder.listFiles()) {
			SaleShow saleShow = new SaleShow();
			saleShow.setId(folder.getName());
			for (File imageFile : folder.listFiles()) {
				File xml = new File(folder, "i.xml");
				try {
					Document document = builder.build(xml);
					Element item = document.getRootElement();
					DateFormat dateFormat = new SimpleDateFormat("yyyy/MM");
					saleShow.setDate(dateFormat.parse(item.getChildText("date")));
					saleShow.setDescription(item.getChildText("desc"));
					saleShow.setTitle(item.getChildText("title"));
				} catch (JDOMException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} catch (ParseException e) {
					e.printStackTrace();
				}

				if (imageFile.getName().startsWith("p.")) {
					saleShow.setPreviewImage(toPath(folder, imageFile));
				} else {
					saleShow.setMoreImages(new ArrayList<String>());
					saleShow.getMoreImages().add(toPath(folder, imageFile));
				}
			}
			saleshows.add(saleShow);
		}
		return saleshows;
	}

	private String toPath(File folder, File imageFile) {
		return BASE_URL + "/" + folder.getName() + "/" + imageFile.getName();
	}
}
