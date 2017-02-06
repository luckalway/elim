package com.vmeifang.biesu.textparser;

import com.vmeifang.biesu.entity.BiesuItem;
import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public class CompositeTextParser implements TextParser {

	public boolean support(String inputText) {
		return true;
	}

	public BiesuItem prase(BiesuItemBuilder builder, String inputText) {
		return null;
	}

}
