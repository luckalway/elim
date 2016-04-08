package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;
import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class BaiyeDataHandler extends AbstractDataHandler {
	private static final int EXPECTED_IMAGE_WITH = 800;
	private static final int EXPECTED_PREVIEW_IMAGE_WITH = 800;

	public void _process(File inFolder, File outFolder) {
		outFolder = new File(outFolder, inFolder.getName());
		try {
			processImages(inFolder, outFolder);
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
		generateItemXmlFile(outFolder);
	}

	private void processImages(File inFolder, File outFolder) throws IOException {
		for (File image : inFolder.listFiles()) {
			if (!ImageUtils.isImage(image))
				continue;
			String imageName = image.getName().toLowerCase();
			if (imageName.startsWith("preview")) {
				processPreviewImage(image, outFolder);
			} else {
				processDetailImage(image, outFolder);
			}
		}
	}

	private void processDetailImage(File image, File outFolder) throws IOException {
		ImageUtils.generateJPGImage(Scalr.resize(ImageIO.read(image), EXPECTED_IMAGE_WITH), outFolder, image.getName()
				.toLowerCase());
	}

	private void processPreviewImage(File image, File outFolder) throws IOException {
		ImageUtils.generateJPGImage(Scalr.resize(ImageIO.read(image), EXPECTED_PREVIEW_IMAGE_WITH), outFolder, image
				.getName().toLowerCase());
	}

	private void generateItemXmlFile(File outFolder) {
		File xmlFile = new File(outFolder, "item.xml");
		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		rootElement.addContent(XmlUtils.createEmptyElement("title"));
		rootElement.addContent(XmlUtils.createEmptyElement("material"));
		rootElement.addContent(XmlUtils.createEmptyElement("price"));

		XmlUtils.outputXmlFile(doc, xmlFile);
	}

}
