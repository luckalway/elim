package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.log4j.Logger;
import org.imgscalr.Scalr;
import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class BaiyeDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(BaiyeDataHandler.class);
	private static final int EXPECTED_IMAGE_WITH = 800;
	private static final int EXPECTED_PREVIEW_IMAGE_WITH = 800;

	public void _process(File inFolder, File outFolder) {
		try {
			for (File baiyeFolder : inFolder.listFiles()) {
				checkIfDirectory(inFolder, baiyeFolder);
				if (!baiyeFolder.getName().startsWith("b")) {
					throw new DataHandleException("Illegal folder name for baiye item: " + baiyeFolder.getName());
				}

				File itemOutFolder = new File(outFolder, baiyeFolder.getName());
				if (generateItemXmlFile(itemOutFolder)) {
					processImages(baiyeFolder, itemOutFolder);
				}
			}
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
	}

	private void processImages(File inFolder, File outFolder) throws IOException {
		checkIfExitPreview(inFolder);

		for (File image : inFolder.listFiles()) {
			if (!ImageUtils.isImage(image)) {
				LOG.warn(image.getName() + " not a image type, skip it");
				continue;
			}
			String imageName = image.getName().toLowerCase();
			if (imageName.startsWith("preview")) {
				processPreviewImage(image, outFolder);
			} else {
				processDetailImage(image, outFolder);
			}
		}
	}

	private void processDetailImage(File image, File outFolder) throws IOException {
		ImageUtils.generateJPGImage(Scalr.resize(ImageIO.read(image), EXPECTED_IMAGE_WITH), outFolder,
				ImageUtils.generateNormImageName(outFolder) + ".jpg");
	}

	private void processPreviewImage(File image, File outFolder) throws IOException {
		ImageUtils.generateJPGImage(Scalr.resize(ImageIO.read(image), EXPECTED_PREVIEW_IMAGE_WITH), outFolder, image
				.getName().toLowerCase());
	}

	private boolean generateItemXmlFile(File outFolder) {
		File xmlFile = new File(outFolder, "item.xml");
		if (xmlFile.exists()) {
			LOG.info(xmlFile.getAbsoluteFile() + " is already exist, skip it.");
			return false;
		}

		if (!outFolder.exists())
			outFolder.mkdir();

		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		rootElement.addContent(XmlUtils.createEmptyElement("title"));
		rootElement.addContent(XmlUtils.createEmptyElement("material"));
		rootElement.addContent(XmlUtils.createEmptyElement("price"));

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

}
