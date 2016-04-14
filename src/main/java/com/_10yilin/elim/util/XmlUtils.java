package com._10yilin.elim.util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;

import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

public class XmlUtils {
	private static final Logger LOG = Logger.getLogger(XmlUtils.class);

	public static Element createElement(String name, Object value) {
		Element element = new Element(name);
		element.setText(String.valueOf(value));
		return element;
	}

	public static Element createElement(String name) {
		return createElement(name, null);
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

	public static <E> E convertDocumentToEntity(Document doc, E e) {
		Element rootElement = doc.getRootElement();
		Class<? extends Object> clazz = e.getClass();
		for (Element element : rootElement.getChildren()) {
			try {
				String fieldName = element.getName();
				int i = fieldName.indexOf("-");
				if (i != -1) {
					fieldName = fieldName.substring(0, i) + fieldName.substring(i + 1, i + 2).toUpperCase()
							+ fieldName.substring(i + 2);
				}

				Field field = clazz.getDeclaredField(fieldName);
				field.setAccessible(true);
				if (field.getType().getName().equals("double")) {
					field.set(e, Double.valueOf(element.getValue()));
				} else if (field.getType().getName().equals("int")) {
					field.set(e, Integer.valueOf(element.getValue()));
				} else {
					field.set(e, element.getValue());
				}
			} catch (SecurityException e1) {
				throw new RuntimeException(e1);
			} catch (NoSuchFieldException e1) {
				LOG.warn("No such field of " + e.getClass().getSimpleName() + "," + e1.getMessage());
			} catch (IllegalArgumentException e1) {
				e1.printStackTrace();
				LOG.error(e1.getMessage());
			} catch (IllegalAccessException e1) {
				LOG.error(e1.getMessage());
			}
		}

		return e;
	}

}
