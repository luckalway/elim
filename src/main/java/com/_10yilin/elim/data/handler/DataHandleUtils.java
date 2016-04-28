package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.util.ImageUtils;
import com._10yilin.elim.util.XmlUtils;

public class DataHandleUtils {
	private static final Logger LOG = Logger.getLogger(DataHandleUtils.class);

	private static final class PreviewFilenameFilter implements FilenameFilter {
		public boolean accept(File dir, String name) {
			return name.startsWith("preview");
		}
	}

	public static void checkIfExistPreview(File inFolder) {
		File[] previews = inFolder.listFiles(new PreviewFilenameFilter());
		if (previews == null || previews.length != 1)
			throw new DataHandleException("Preview image or folder is not exist in " + inFolder.getAbsolutePath());
		File preview = previews[0];
		if (preview.isFile() && !ImageUtils.isImage(preview))
			throw new DataHandleException("Upexpected file type of " + preview.getAbsolutePath());
	}

	public static void processImage(File image, File outFolder) throws IOException {
		String imageName = null;
		if (isPreviewImage(image)) {
			imageName = "preview.jpg";
		} else {
			imageName = ImageUtils.generateNormImageName(outFolder);
		}

		ImageUtils.generateMutiSizeImages(image, outFolder, imageName.toLowerCase());
	}

	public static void processImages(File inFolder, File outFolder) throws IOException {
		if (!inFolder.isDirectory()) {
			throw new DataHandleException("Expected directory, but receive " + inFolder);
		}

		outFolder.mkdirs();
		for (File image : inFolder.listFiles()) {
			if (!ImageUtils.isImage(image)) {
				LOG.warn("Expected image but receive " + image);
				continue;
			}

			DataHandleUtils.processImage(image, outFolder);
		}
	}

	public static boolean isPreviewFolder(File file) {
		if (file.isDirectory()) {
			return file.getName().equals("preview");
		}
		return false;
	}

	public static boolean isPreviewImage(File file) {
		return ImageUtils.isImage(file) && file.getName().startsWith("preview");
	}

	public static boolean isSkuFolder(File folder) {
		for (File child : folder.listFiles()) {
			if (!ImageUtils.isImage(child)) {
				return false;
			}
		}
		return true;
	}

	public static void batchSetValues(String cate, Map<String, String> filter, Map<String, Object> values)
			throws IOException {
		File folderForScan = new File(Constants.PROJECT_HOME + "app/data/" + cate);
		if (!folderForScan.exists())
			throw new DataHandleException("fold not exist," + folderForScan);
		if (filter.isEmpty())
			throw new IllegalArgumentException("filter must not be empty.");

		SAXBuilder builder = new SAXBuilder();
		for (File itemFolder : folderForScan.listFiles()) {
			File itemXML = new File(itemFolder, "item.xml");
			try {
				Document document = builder.build(new FileInputStream(itemXML));
				Element root = document.getRootElement();
				boolean match = true;
				for (String key : filter.keySet()) {
					if (root.getChildText(key) == null) {
						throw new IllegalArgumentException("can not found a field with name " + key + " on "
								+ document.toString());
					}
					if (!root.getChildText(key).trim().equals(filter.get(key).trim())) {
						match = false;
						break;
					}
				}

				if (match) {
					for (String key : values.keySet()) {
						root.getChild(key).setText(values.get(key).toString());
					}
					XmlUtils.outputXmlFile(document, itemXML);
				}
			} catch (JDOMException e) {
				throw new DataHandleException(e);
			}
		}
	}

	public static void main(String[] args) throws IOException {
		Map<String, Object> values = new HashMap<String, Object>();
		Map<String, String> filter = new HashMap<String, String>();
		filter.put("style", "null");
		values.put("style", "无");
		batchSetValues("buyi", filter, values);
	}
}
