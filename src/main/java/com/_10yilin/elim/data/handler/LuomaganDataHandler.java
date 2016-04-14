package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;
import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class LuomaganDataHandler extends AbstractDataHandler {

	private static final int EXPECTED_IMAGE_WITH = 800;
	private static final int EXPECTED_PREVIEW_IMAGE_WITH = 800;

	@Override
	protected boolean precheck(File inFolder, File outFolder) {
		DataHandleUtils.checkIfExistPreview(inFolder);
		return super.precheck(inFolder, outFolder);
	}

	public void process(File inFolder, File outFolder) {
		try {
			generateItemXmlFile(outFolder);
			processImages(inFolder, outFolder);
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
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
			return false;
		}

		if (!outFolder.exists())
			outFolder.mkdir();

		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		rootElement.addContent(XmlUtils.createElement("title"));
		rootElement.addContent(XmlUtils.createElement("material"));
		rootElement.addContent(XmlUtils.createElement("price"));

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

}
