package com._10yilin.elim.util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

public class XmlUtils {
	private static final Logger LOG = Logger.getLogger(XmlUtils.class);

	public static Element createEmptyElement(String name) {
		Element element = new Element(name);
		element.setText("null");
		return element;
	}

	public static void outputXmlFile(Document doc, File xmlFile) {
		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat());
		try {
			xmlOutput.output(doc, new FileWriter(xmlFile));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		LOG.debug("Generated the item xml file - " + xmlFile.getAbsolutePath());
	}
}
