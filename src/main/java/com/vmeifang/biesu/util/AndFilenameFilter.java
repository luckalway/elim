package com.vmeifang.biesu.util;

import java.io.File;
import java.io.FilenameFilter;

public class AndFilenameFilter implements FilenameFilter {

	private String[] strs = {};

	public AndFilenameFilter(String... strs) {
		this.strs = strs;
	}

	public boolean accept(File dir, String name) {
		if (strs.length == 0)
			return false;

		for (String str : strs) {
			if (!name.contains(str)) {
				return false;
			}
		}
		return true;
	}

}
