package com.vmeifang.biesu;

import java.io.File;

import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;
import com.vmeifang.biesu.filenameparser.DefaultFilenameParser;
import com.vmeifang.biesu.filenameparser.FilenameParser;
import com.vmeifang.biesu.imagesparser.DefaultImagesParser;
import com.vmeifang.biesu.imagesparser.ImagesParser;
import com.vmeifang.biesu.textparser.CompositeTextParser;
import com.vmeifang.biesu.textparser.TextParser;

public class BiesuMain {
	private static final DefaultImagesParser DEFAULT_IMAGES_PARSER = new DefaultImagesParser();
	private static final CompositeTextParser COMPOSITE_TEXT_PARSER = new CompositeTextParser();
	private static final DefaultFilenameParser DEFAULT_FILENAME_PARSER = new DefaultFilenameParser();
	private static final File ROOT_FOLDER = new File("");

	public static void main(String[] args) {
		for (File file : ROOT_FOLDER.listFiles()) {
			for (File itemFiler : file.listFiles()) {
				BiesuItemBuilder builder = new BiesuItemBuilder();
				FilenameParser filenameParser = DEFAULT_FILENAME_PARSER;
				filenameParser.parse(builder, itemFiler.getName());
				TextParser textParser = COMPOSITE_TEXT_PARSER;
				textParser.prase(builder, null);
				ImagesParser imagesParser = DEFAULT_IMAGES_PARSER;
				imagesParser.parse(builder, file);
			}
		}
	}

}
