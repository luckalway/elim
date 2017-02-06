package com.vmeifang.biesu.textparser;

import com.vmeifang.biesu.entity.BiesuItem;
import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public class BuildingStructureParser implements TextParser {

	public boolean support(String inputText) {
		return inputText.indexOf("�ṹ") != -1;
	}

	public BiesuItem prase(BiesuItemBuilder builder, String inputText) {
		int pos = inputText.indexOf("�ṹ");
		String substring = inputText.substring(0, pos);
		String structure = substring.split(" |,")[substring.split(" |,").length - 1];
		// TODO
		return null;
	}

}
