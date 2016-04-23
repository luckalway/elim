package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;
import java.util.regex.Pattern;

import org.jdom2.Document;
import org.jdom2.Element;

import com._10yilin.elim.util.XmlUtils;

public class BuYiDataHandler extends AbstractDataHandler {
	private static final String REG_EXP_1 = "[a-zA-Z0-9-]+";
	private static final String REG_EXP_2 = "[a-zA-Z0-9-]+([\u4E00-\u9FA5]+)";
	private static final Pattern PATTERN1 = Pattern.compile(REG_EXP_1);
	private static final Pattern PATTERN2 = Pattern.compile(REG_EXP_2);

	private String craft = null;
	private String material = null;

	@Override
	protected boolean precheck(File inFolder, File outFolder) {
		if (inFolder.isFile())
			return false;
		DataHandleUtils.checkIfExistPreview(inFolder);
		boolean chineseColor = false;
		boolean nonChineseColor = false;
		for (File sku : inFolder.listFiles()) {
			if (sku.isFile() || DataHandleUtils.isPreviewFolder(sku))
				continue;

			if (PATTERN2.matcher(sku.getName()).matches()) {
				chineseColor = true;
			}

			if (PATTERN1.matcher(sku.getName()).matches()) {
				nonChineseColor = true;
			}

			if (chineseColor == nonChineseColor) {
				throw new DataHandleException("Invalid sku name[" + sku + "]");
			}

		}
		return super.precheck(inFolder, outFolder);
	}

	@Override
	void process(File inFolder, File outFolder) {
		try {
			generateItemXml(inFolder, outFolder);
			if (DataHandleUtils.isSkuFolder(inFolder)) {
				DataHandleUtils.processImages(inFolder,
						new File(outFolder, inFolder.getName().replaceAll("-[\u4E00-\u9FA5]+", "")));
				return;
			}

			for (File sku : inFolder.listFiles()) {
				DataHandleUtils.processImages(sku, new File(outFolder, sku.getName()
						.replaceAll("-[\u4E00-\u9FA5]+", "")));
			}
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
	}

	private boolean generateItemXml(File product, File productOut) throws IOException {
		File xmlFile = new File(productOut, "item.xml");
		if (xmlFile.exists())
			return false;

		Document doc = new Document();
		Element rootElement = new Element("item");
		doc.setRootElement(rootElement);
		rootElement.addContent(XmlUtils.createElement("title"));
		rootElement.addContent(XmlUtils.createElement("shading-percent", 85));
		rootElement.addContent(XmlUtils.createElement("material", material));
		rootElement.addContent(XmlUtils.createElement("craft", craft));
		rootElement.addContent(XmlUtils.createElement("style"));
		rootElement.addContent(XmlUtils.createElement("price", 0));

		// if not exist
		StringBuilder colors = new StringBuilder();
		for (File sku : product.listFiles()) {
			if (DataHandleUtils.isPreviewFolder(sku) || sku.isFile())
				continue;
			colors.append(sku.getName()).append(";");
		}
		Element colorElement = new Element("colors");
		colorElement.setText(colors.toString());
		rootElement.addContent(colorElement);

		XmlUtils.outputXmlFile(doc, xmlFile);
		return true;
	}

	public void setCraft(String category) {
		this.craft = category;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

}
