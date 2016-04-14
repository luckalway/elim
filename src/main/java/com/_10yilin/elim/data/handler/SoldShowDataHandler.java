package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;
import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class SoldShowDataHandler extends AbstractDataHandler implements DataHandler {
	private static final int EXPECTED_IMAGE_WITH = 800;
	private static final int EXPECTED_PREVIEW_IMAGE_WITH = 800;

	public void process(File inFolder, File outFolder) {
		try {
			generateItemXml(outFolder);
			processImages(inFolder, outFolder);
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
	}

	private void processImages(File inFolder, File itemOut) throws IOException {
		for (File image : inFolder.listFiles()) {
			if (!ImageUtils.isImage(image))
				continue;
			String imageName = image.getName().toLowerCase();
			if (imageName.startsWith("preview")) {
				processPreviewImage(image, itemOut);
			} else {
				processDetailImage(image, itemOut);
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

	private boolean generateItemXml(File itemOut) {
		File xmlFile = new File(itemOut, "item.xml");
		if (xmlFile.exists()) {
			return false;
		}
		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		rootElement.addContent(XmlUtils.createElement("title"));
		rootElement.addContent(XmlUtils.createElement("date"));
		rootElement.addContent(XmlUtils.createElement("desc"));

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

}
