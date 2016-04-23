package com._10yilin.elim.dao.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom2.Document;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.BuyiProductDao;
import com._10yilin.elim.dao.support.ImageFilenameFilter;
import com._10yilin.elim.data.handler.DataHandleUtils;
import com._10yilin.elim.entity.BuyiProduct;
import com._10yilin.elim.util.XmlUtils;

public class BuyiProductDaoImpl implements BuyiProductDao {
	private File rootFolder = null;

	private String BASE_FOLDER = Constants.PROJECT_HOME + "/app/data/buyi/";
	private String BASE_URL = Constants.BASE_URL + "/app/data/buyi/";

	public BuyiProductDaoImpl() {
		this.rootFolder = new File(BASE_FOLDER);
	}

	public List<BuyiProduct> getAllProducts() {
		List<BuyiProduct> curtainProducts = new ArrayList<BuyiProduct>();
		SAXBuilder builder = new SAXBuilder();
		try {
			for (File itemFolder : this.rootFolder.listFiles()) {
				Document document = builder.build(new FileInputStream(new File(itemFolder, "item.xml")));
				BuyiProduct product = new BuyiProduct();
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
		List<String> previewImages = new ArrayList<String>();
		if (new File(itemFolder, "preview.jpg").exists()) {
			previewImages.add(BASE_URL + "/" + itemFolder.getName() + "/preview.jpg");
			return previewImages;
		}

		File previewImageFolder = new File(itemFolder, "preview");
		if (!previewImageFolder.exists())
			throw new IllegalStateException("Can not found the preivew folder under " + itemFolder);

		File[] imageFiles = previewImageFolder.listFiles(new FilenameFilter() {
			public boolean accept(File dir, String name) {
				return name.matches(Constants.REG_EXP_IMAGE_NAME);
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
		if (colors.length == 1 || DataHandleUtils.isSkuFolder(itemFolder)) {
			List<String> images = new ArrayList<String>();
			String[] imageList = itemFolder.list(new ImageFilenameFilter());
			for (String imageName : imageList) {
				String imageUrl = null;
				imageUrl = BASE_URL + "/" + itemFolder.getName() + "/" + imageName;
				images.add(imageUrl);
			}
			imageGroups.put(colors[0], images);
			return imageGroups;
		}

		for (String color : colors) {
			String skucode = color.replaceAll("-[\u4E00-\u9FA5]+", "");
			File oneColorImageFolder = new File(itemFolder, skucode);
			if (!oneColorImageFolder.exists())
				throw new IllegalStateException("Can not found " + oneColorImageFolder);

			List<String> images = new ArrayList<String>();
			String[] imageList = oneColorImageFolder.list(new ImageFilenameFilter());
			for (String imageName : imageList) {
				String imageUrl = null;
				imageUrl = BASE_URL + "/" + itemFolder.getName() + "/" + skucode + "/" + imageName;
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
