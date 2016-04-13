package com._10yilin.elim.data.handler;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.log4j.Logger;
import org.imgscalr.Scalr;
import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class BuYiDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(BuYiDataHandler.class);

	@Override
	protected boolean precheck(File inFolder, File outFolder) {
		File previewFolder = new File(inFolder, "preview");
		if (!previewFolder.exists() || previewFolder.isFile())
			throw new DataHandleException(previewFolder.getAbsolutePath() + " is not exist.");
		return super.precheck(inFolder, outFolder);
	}

	@Override
	void _process(File inFolder, File outFolder) {
		try {
			generateItemXml(inFolder, outFolder);

			for (File sku : inFolder.listFiles()) {
				File skuOutFolder = new File(outFolder, sku.getName());
				skuOutFolder.mkdirs();

				if (sku.getName().equals("preview")) {
					processPreviewImages(sku, skuOutFolder);
					continue;
				}
				processGallery(sku, skuOutFolder);
			}
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
	}

	private boolean generateItemXml(File product, File productOut) throws IOException {
		File xmlFile = new File(productOut, "item.xml");
		if (xmlFile.exists())
			return false;

		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		rootElement.addContent(XmlUtils.createElement("title"));
		rootElement.addContent(XmlUtils.createElement("shading-percent", 85));
		rootElement.addContent(XmlUtils.createElement("material"));
		rootElement.addContent(XmlUtils.createElement("style"));
		rootElement.addContent(XmlUtils.createElement("price", 0));

		// if not exist
		StringBuilder colors = new StringBuilder();
		for (File sku : product.listFiles()) {
			if (sku.getName().equals("preview"))
				continue;
			colors.append(sku.getName()).append(";");
		}
		Element colorElement = new Element("colors");
		colorElement.setText(colors.toString());
		rootElement.addContent(colorElement);

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

	private static void processGallery(File sku, File target) throws IOException {
		for (File originImage : sku.listFiles()) {
			if (!ImageUtils.isImage(originImage)) {
				LOG.warn("Expect Image file but [" + originImage.getAbsolutePath() + "]");
				continue;
			}
			BufferedImage scaledImage = Scalr.resize(ImageIO.read(originImage), 750);
			String newImageName = originImage.getName().toLowerCase();
			File compressedImage = new File(target, newImageName);
			ImageUtils.generateJPGImage(scaledImage, compressedImage);

			ImageUtils.generateJPGImage(Scalr.resize(ImageIO.read(originImage), 160), target, newImageName
					+ "_160x160.jpg");

			LOG.info(originImage.getAbsolutePath() + " ----> " + compressedImage.getAbsolutePath());
		}
	}

	private static void processPreviewImages(File sku, File target) throws IOException {
		for (File originImage : sku.listFiles()) {
			BufferedImage scaledImage = Scalr.resize(ImageIO.read(originImage), 400);
			String newImageName = originImage.getName().toLowerCase();
			File compressedImage = new File(target, newImageName);
			ImageIO.write(scaledImage, "jpg", compressedImage);

			BufferedImage scaled160Image = Scalr.resize(ImageIO.read(originImage), 80);
			ImageIO.write(scaled160Image, "jpg", new File(target, newImageName + "_80x80.jpg"));

			LOG.info(originImage.getAbsolutePath() + " ----> " + compressedImage.getAbsolutePath());
		}
	}

}
