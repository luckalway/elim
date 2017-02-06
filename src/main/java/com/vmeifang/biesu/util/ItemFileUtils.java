package com.vmeifang.biesu.util;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Arrays;
import java.util.List;

public class ItemFileUtils {
	public static List<File> getEffectImages(File file) {
		return Arrays.asList(file.listFiles(new AndFilenameFilter("Ð§¹û", "jpg")));
	}

	public static String getDescription(File file) {
		// TODO
		return null;
	}
}
