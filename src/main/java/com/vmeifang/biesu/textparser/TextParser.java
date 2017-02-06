package com.vmeifang.biesu.textparser;

import com.vmeifang.biesu.entity.BiesuItem;
import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public interface TextParser {
	boolean support(String inputText);

	BiesuItem prase(BiesuItemBuilder builder, String inputText);
}
