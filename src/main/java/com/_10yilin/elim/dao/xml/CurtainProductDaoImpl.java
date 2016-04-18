package com._10yilin.elim.dao.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.CurtainProductDao;
import com._10yilin.elim.entity.CurtainProduct;
import com._10yilin.elim.util.XmlUtils;

public class CurtainProductDaoImpl implements CurtainProductDao {

	private File rootFolder = null;
	private String BASE_FOLDER = Constants.PROJECT_HOME + "/app/data/buyi/";
	private String BASE_URL = Constants.BASE_URL + "/app/data/buyi/";

	public CurtainProductDaoImpl() {
		this.rootFolder = new File(BASE_FOLDER);
	}

	public List<CurtainProduct> getAllProducts() {
		List<CurtainProduct> curtainProducts = new ArrayList<CurtainProduct>();
		SAXBuilder builder = new SAXBuilder();
		try {
			for (File itemFolder : this.rootFolder.listFiles()) {
				Document document = builder.build(new FileInputStream(new File(itemFolder, "item.xml")));
				CurtainProduct product = new CurtainProduct();
				product.setId(itemFolder.getName());
				XmlUtils.convertDocumentToEntity(document, product);
				String[] colors = product.getColors().split(";");

				product.setPreviewImages(getPreviewImages(itemFolder));
				product.setGalleryGroups(getImageGroups(itemFolder, colors));
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
		File previewImageFolder = new File(itemFolder, "preview");
		if (!previewImageFolder.exists())
			throw new IllegalStateException("Can not found the preivew folder of, " + itemFolder.getName());

		List<String> previewImages = new ArrayList<String>();
		File[] imageFiles = previewImageFolder.listFiles(new FilenameFilter() {
			public boolean accept(File dir, String name) {
				return name.indexOf("jpg_") == -1;
			}
		});
		if (imageFiles.length == 0 || imageFiles.length > 5)
			throw new IllegalStateException("Preivew images must be < 5 and > 0, " + itemFolder.getAbsolutePath());

		for (File imageFile : imageFiles) {
			previewImages.add(BASE_URL + "/" + itemFolder.getName() + "/preview/" + imageFile.getName());
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
			String[] imageList = oneColorImageFolder.list(new FilenameFilter() {
				public boolean accept(File dir, String name) {
					return name.indexOf("160") == -1;
				}
			});
			for (String imageName : imageList) {
				String imageUrl = null;
				try {
					imageUrl = BASE_URL + "/" + URLEncoder.encode(itemFolder.getName(), "UTF-8") + "/" + color + "/"
							+ URLEncoder.encode(imageName, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
				images.add(imageUrl);
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

}
