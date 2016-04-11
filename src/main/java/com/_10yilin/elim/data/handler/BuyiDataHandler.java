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

public class BuyiDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(BuyiDataHandler.class);

	public void _process(File inFolder, File outFolder) {
		LOG.info("Start process " + inFolder);
		if (hasFile(inFolder, "flag")) {
			try {
				traverseProcess(inFolder, outFolder);
			} catch (IOException e) {
				throw new DataHandleException(e);
			}
			return;
		}

		for (File child : inFolder.listFiles()) {
			if (child.isFile()) {
				LOG.warn("No flag file found for the path[" + inFolder.getAbsolutePath() + "]");
				break;
			}
			_process(child, outFolder);
		}
		LOG.info("Processed finished, out to " + outFolder);
	}

	private void traverseProcess(File inFolder, File outFolder) throws IOException {
		for (File product : inFolder.listFiles()) {
			File productOut = new File(outFolder, product.getName());
			if (product.isFile() || !generateItemXml(product, productOut))
				continue;

			LOG.info("Start process product:" + product.getName());
			for (File sku : product.listFiles()) {
				File skuOutFolder = new File(productOut, sku.getName());
				skuOutFolder.mkdirs();
				LOG.info("Start process sku:" + sku.getName());

				if (sku.getName().equals("preview")) {
					processPreviewImages(sku, skuOutFolder);
					continue;
				}
				processGallery(sku, skuOutFolder);
			}
		}
	}

	private boolean generateItemXml(File product, File productOut) throws IOException {
		File xmlFile = new File(productOut, "item.xml");
		if (xmlFile.exists())
			return false;

		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		rootElement.addContent(XmlUtils.createEmptyElement("title"));
		rootElement.addContent(XmlUtils.createEmptyElement("shading-percent"));
		rootElement.addContent(XmlUtils.createEmptyElement("material"));
		rootElement.addContent(XmlUtils.createEmptyElement("style"));
		rootElement.addContent(XmlUtils.createEmptyElement("price"));

		// if not exist
		rootElement.removeChild("color");
		StringBuilder colors = new StringBuilder();
		for (File sku : product.listFiles()) {
			if (sku.getName().equals("preview"))
				continue;
			colors.append(sku.getName()).append(";");
		}
		Element colorElement = new Element("color");
		colorElement.setText(colors.toString());
		rootElement.addContent(colorElement);

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

	private static void processGallery(File sku, File target) throws IOException {
		for (File originImage : sku.listFiles()) {
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

	private static boolean hasFile(File folder, String fileName) {
		return new File(folder, fileName).exists();
	}
}
