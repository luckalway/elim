package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.XmlUtils;

public class SoldShowDataHandler extends AbstractDataHandler implements DataHandler {

	public void process(File inFolder, File outFolder) {
		try {
			generateItemXml(outFolder);
			DataHandleUtils.optimizeImages(inFolder, outFolder);
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
	}

	private boolean generateItemXml(File outFolder) {
		File xmlFile = new File(outFolder, "item.xml");
		if (xmlFile.exists()) {
			return false;
		}
		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM");
		rootElement.addContent(XmlUtils.createElement("title"));
		Element dateElement = XmlUtils.createElement("date", dateFormat.format(new Date()));
		dateElement.setAttribute("type", "date");
		rootElement.addContent(dateElement);
		rootElement.addContent(XmlUtils.createElement("description"));

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

}
