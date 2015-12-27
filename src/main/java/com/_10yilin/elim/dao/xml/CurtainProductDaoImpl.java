package com._10yilin.elim.dao.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.CurtainProductDao;
import com._10yilin.elim.entity.CurtainProduct;

public class CurtainProductDaoImpl implements CurtainProductDao {

	private File rootFolder = null;
	private String BASE_FOLDER = Constants.PROJECT_HOME + "/" + Constants.FOLDER_CURTAIN_DATA;
	private String BASE_URL = Constants.BASE_URL + "/" + Constants.FOLDER_CURTAIN_DATA;

	public CurtainProductDaoImpl() {
		this.rootFolder = new File(BASE_FOLDER);
	}

	public List<CurtainProduct> getAllProducts() {
		List<CurtainProduct> curtainProducts = new ArrayList<CurtainProduct>();
		SAXBuilder builder = new SAXBuilder();
		try {
			for (File itemFolder : this.rootFolder.listFiles()) {
				Document document = builder.build(new FileInputStream(new File(itemFolder, "i.xml")));
				CurtainProduct product = new CurtainProduct();
				product.setId(itemFolder.getName());
				Element item = document.getRootElement();
				product.setPrice(Double.valueOf(item.getChild("price").getText()));
				product.setShadingPercent(Integer.valueOf(item.getChild("shading-percent").getText()));
				product.setStyle(item.getChild("style").getText());
				String[] colors = item.getChild("colors").getText().split(";");

				product.setPreviewImages(getPreviewImages(itemFolder));
				product.setImageGroups(getImageGroups(itemFolder, colors));
				curtainProducts.add(product);
			}
		} catch (IOException e) {
			e.printStackTrace();
			throw new IllegalArgumentException(e);
		} catch (JDOMException e) {
			e.printStackTrace();
			throw new IllegalArgumentException(e);
		}
		return curtainProducts;
	}

	private List<String> getPreviewImages(File itemFolder) {
		File previewImageFolder = new File(itemFolder, "p");
		if (!previewImageFolder.exists())
			throw new IllegalStateException("Can not found the preivew folder of, " + itemFolder.getName());

		List<String> previewImages = new ArrayList<String>();
		File[] imageFiles = previewImageFolder.listFiles();
		if (imageFiles.length == 0 || imageFiles.length > 5)
			throw new IllegalStateException("Preivew images must be < 5 and > 0, " + itemFolder.getName());

		for (File imageFile : imageFiles) {
			previewImages.add(toPath(itemFolder, imageFile));
		}
		return previewImages;
	}

	private Map<String, List<String>> getImageGroups(File itemFolder, String[] colors) {
		Map<String, List<String>> imageGroups = new HashMap<String, List<String>>();
		for (String color : colors) {
			File oneColorImageFolder = new File(itemFolder, color);
			if (!oneColorImageFolder.exists())
				throw new IllegalStateException("Can not found " + oneColorImageFolder);

			List<String> images = new ArrayList<String>();
			for (String imageName : oneColorImageFolder.list()) {
				images.add(BASE_URL + "/" + color + "/" + imageName);
			}
			imageGroups.put(color, images);
		}
		return imageGroups;
	}

	public List<String> getRecommendProductIds() {
		List<String> recommendProductIds = new ArrayList<String>();
		for (File itemFolder : this.rootFolder.listFiles()) {
			if (new File(itemFolder, "r").exists()) {
				recommendProductIds.add(itemFolder.getName());
			}
		}
		return recommendProductIds;
	}

	private String toPath(File folder, File imageFile) {
		return BASE_URL + "/" + folder.getName() + "/" + imageFile.getName();
	}
}
