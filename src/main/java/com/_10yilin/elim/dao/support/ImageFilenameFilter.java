package com._10yilin.elim.dao.support;

import java.io.File;
import java.io.FilenameFilter;

import com._10yilin.elim.Constants;

public class ImageFilenameFilter implements FilenameFilter {

	public boolean accept(File dir, String name) {
		return name.matches(Constants.REG_EXP_IMAGE_NAME);
	}
}
