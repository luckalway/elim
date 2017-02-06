package com.vmeifang.biesu.filenameparser;

import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public class DefaultFilenameParser implements FilenameParser {

	public void parse(BiesuItemBuilder builder, String name) {
		String[] array = name.split("-");
		String wh = array[2].replaceAll("[^\\x00-\\xff]|-", "");
		String width = wh.split("&")[0];
		String height = wh.split("&")[1];
		builder.build(array[0], array[1], Double.parseDouble(width), Double.parseDouble(height));
	}
}
