package com._10yilin.elim.data.handler;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.log4j.Logger;
import org.imgscalr.Scalr;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class BuyiDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(BuyiDataHandler.class);

	public void _process(File inFolder, File outFolder) {
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
	}

	private void traverseProcess(File inFolder, File outFolder) throws IOException {
		for (File product : inFolder.listFiles()) {
			if (product.isFile())
				continue;

			LOG.info("Start process product:" + product.getName());
			for (File sku : product.listFiles()) {
				File target = new File(outFolder, product.getName() + "/" + sku.getName());
				target.mkdirs();
				LOG.info("Start process sku:" + sku.getName());

				if (sku.getName().equals("preview")) {
					processPreviewImages(sku, target);
					continue;
				}
				processGallery(sku, target);
			}
			generateItemXml(product, outFolder);
		}
	}

	private void generateItemXml(File product, File outFolder) throws IOException {
		File xmlFile = new File(new File(outFolder, product.getName()), "item.xml");
		SAXBuilder builder = new SAXBuilder();
		Document doc = null;
		if (xmlFile.exists()) {
			try {
				doc = builder.build(new FileInputStream(xmlFile));
			} catch (JDOMException e) {
				throw new IOException(e);
			}
		} else {
			doc = new Document();
			Element rootElement = new Element("item");
			doc.setRootElement(rootElement);
			rootElement.addContent(XmlUtils.createEmptyElement("title"));
			rootElement.addContent(XmlUtils.createEmptyElement("shading-percent"));
			rootElement.addContent(XmlUtils.createEmptyElement("material"));
			rootElement.addContent(XmlUtils.createEmptyElement("style"));
			rootElement.addContent(XmlUtils.createEmptyElement("price"));
		}
		Element rootElement = doc.getRootElement();

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
