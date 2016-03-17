package com._10yilin.elim.gallery;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.log4j.Logger;
import org.imgscalr.Scalr;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

public class Compressor {
	private static final Logger LOG = Logger.getLogger(Compressor.class);

	public static void main(String[] args) throws IOException {
		final File outFolder = new File("G:\\demo");
		File inFolder = new File("G:\\BaiduYunDownload");
		process(inFolder, outFolder);
	}

	private static void process(File inFolder, File outFolder) throws IOException {
		if (hasFile(inFolder, "flag")) {
			traverseProcess(inFolder, outFolder);
			return;
		}

		for (File child : inFolder.listFiles()) {
			if (child.isFile()) {
				LOG.warn("No flag file found for the path[" + inFolder.getAbsolutePath() + "]");
				break;
			}
			process(child, outFolder);
		}
	}

	private static void traverseProcess(File inFolder, File outFolder) throws IOException {
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

	private static void generateItemXml(File product, File outFolder) throws IOException {
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
			rootElement.addContent(createEmptyElement("title"));
			rootElement.addContent(createEmptyElement("shading-percent"));
			rootElement.addContent(createEmptyElement("material"));
			rootElement.addContent(createEmptyElement("style"));
			rootElement.addContent(createEmptyElement("price"));
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

		XMLOutputter xmlOutput = new XMLOutputter();

		xmlOutput.setFormat(Format.getPrettyFormat());

		xmlOutput.output(doc, new FileWriter(xmlFile));
		LOG.info("Generated the item xml file - " + xmlFile.getAbsolutePath());
	}

	private static Element createEmptyElement(String name) {
		Element element = new Element(name);
		element.setText("null");
		return element;
	}

	private static void processGallery(File sku, File target) throws IOException {
		for (File originImage : sku.listFiles()) {
			BufferedImage scaledImage = Scalr.resize(ImageIO.read(originImage), 750);
			String newImageName = originImage.getName().toLowerCase();
			File compressedImage = new File(target, newImageName);
			ImageIO.write(scaledImage, "jpg", compressedImage);

			BufferedImage scaled160Image = Scalr.resize(ImageIO.read(originImage), 160);
			ImageIO.write(scaled160Image, "jpg", new File(target, newImageName + "_160x160.jpg"));

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
