package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;

import org.apache.log4j.Logger;

import com._10yilin.elim.util.ImageUtils;

public class DataHandleUtils {
	private static final Logger LOG = Logger.getLogger(DataHandleUtils.class);

	private static final class PreviewFilenameFilter implements FilenameFilter {
		public boolean accept(File dir, String name) {
			return name.startsWith("preview");
		}
	}

	public static void checkIfExistPreview(File inFolder) {
		File[] previews = inFolder.listFiles(new PreviewFilenameFilter());
		if (previews.length != 1)
			throw new DataHandleException("Preview image or folder is not exist in " + inFolder.getAbsolutePath());
		File preview = previews[0];
		if (preview.isFile() && !ImageUtils.isImage(preview))
			throw new DataHandleException("Upexpected file type of " + preview.getAbsolutePath());
	}

	public static void processImage(File image, File outFolder) throws IOException {
		String imageName = null;
		if (isPreviewImage(image)) {
			imageName = "preview.jpg";
		} else {
			imageName = ImageUtils.generateNormImageName(outFolder);
		}

		ImageUtils.generateMutiSizeImages(image, outFolder, imageName.toLowerCase());
	}

	public static void processImages(File inFolder, File outFolder) throws IOException {
		if (!inFolder.isDirectory()) {
			throw new DataHandleException("Expected directory, but receive " + inFolder);
		}

		outFolder.mkdirs();
		for (File image : inFolder.listFiles()) {
			if (!ImageUtils.isImage(image)) {
				LOG.warn("Expected image but receive " + image);
				continue;
			}

			DataHandleUtils.processImage(image, outFolder);
		}
	}

	public static boolean isPreviewFolder(File file) {
		if (file.isDirectory()) {
			return file.getName().equals("preview");
		}
		return false;
	}

	public static boolean isPreviewImage(File file) {
		return ImageUtils.isImage(file) && file.getName().startsWith("preview");
	}

	public static boolean isSkuFolder(File folder) {
		for (File child : folder.listFiles()) {
			if (!ImageUtils.isImage(child)) {
				return false;
			}
		}
		return true;
	}
}
