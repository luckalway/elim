package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;

import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.XmlUtils;

public class BaiyeDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(BaiyeDataHandler.class);

	@Override
	protected boolean precheck(File inFolder, File outFolder) {
		DataHandleUtils.checkIfExistPreview(inFolder);
		return super.precheck(inFolder, outFolder);
	}

	public void process(File inFolder, File outFolder) {
		try {
			generateItemXmlFile(outFolder);
			DataHandleUtils.optimizeImages(inFolder, outFolder);
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
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
		rootElement.addContent(XmlUtils.createElement("title"));
		rootElement.addContent(XmlUtils.createElement("material"));
		rootElement.addContent(XmlUtils.createElement("price", 0));

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

}
