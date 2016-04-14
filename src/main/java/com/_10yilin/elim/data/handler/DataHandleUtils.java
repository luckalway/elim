package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.FilenameFilter;

import com._10yilin.elim.util.ImageUtils;

public class DataHandleUtils {
	private static final class PreviewFilenameFilter implements FilenameFilter {
		public boolean accept(File dir, String name) {
			return name.startsWith("preview");
		}
	}

	public static void checkIfExistPreview(File inFolder) {
		File[] previews = inFolder.listFiles(new PreviewFilenameFilter());
		if (previews.length != 1)
			throw new DataHandleException("Preview image/folder is not exist in " + inFolder.getAbsolutePath());
		File preview = previews[0];
		if (preview.isFile() && !ImageUtils.isImage(preview))
			throw new DataHandleException("Upexpected file type of " + preview.getAbsolutePath());
	}
}
