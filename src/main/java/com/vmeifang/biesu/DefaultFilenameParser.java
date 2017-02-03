package com.vmeifang.biesu;

public class DefaultFilenameParser implements FilenameParser {

	public BiesuItem parse(BiesuItem item, String name) {
		String[] array = name.split("-");
		item.setId(array[0]);
		item.setType(array[1]);
		String wh = array[2].replaceAll("[^\\x00-\\xff]|-", "");
		String width = wh.split("&")[0];
		String height = wh.split("&")[1];
		item.setWidth(Double.parseDouble(width));
		item.setHeight(Double.parseDouble(height));
		return item;
	}
}
