package com.vmeifang.biesu.imagesparser;

import java.io.File;

import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public interface ImagesParser {
	void parse(BiesuItemBuilder builder, File folder);
}
