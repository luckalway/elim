package com.vmeifang.biesu.filenameparser;

import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public interface FilenameParser {
	void parse(BiesuItemBuilder builder, String name);
}
