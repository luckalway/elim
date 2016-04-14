package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;

import com._10yilin.elim.util.ImageUtils;

public class DataHandleUtils {
	private static final class PreviewFilenameFilter implements FilenameFilter {
		public boolean accept(File dir, String name) {
			return name.startsWith("preview");
		}
	}

	private static final int EXPECTED_IMAGE_WITH = 800;
	private static final int EXPECTED_PREVIEW_IMAGE_WITH = 800;

	public static void checkIfExistPreview(File inFolder) {
		File[] previews = inFolder.listFiles(new PreviewFilenameFilter());
		if (previews.length != 1)
			throw new DataHandleException("Preview image/folder is not exist in " + inFolder.getAbsolutePath());
		File preview = previews[0];
		if (preview.isFile() && !ImageUtils.isImage(preview))
			throw new DataHandleException("Upexpected file type of " + preview.getAbsolutePath());
	}

	public static void optimizeDetailImage(File image, File outFolder) throws IOException {
		ImageUtils.generateJPGImage(Scalr.resize(ImageIO.read(image), EXPECTED_IMAGE_WITH), outFolder,
				ImageUtils.generateNormImageName(outFolder));
	}

	public static void optimizePreviewImage(File image, File outFolder) throws IOException {
		ImageUtils.generateJPGImage(Scalr.resize(ImageIO.read(image), EXPECTED_PREVIEW_IMAGE_WITH), outFolder, image
				.getName().toLowerCase());
	}

	public static void optimizeImages(File inFolder, File outFolder) throws IOException {
		for (File image : inFolder.listFiles()) {
			if (!ImageUtils.isImage(image))
				continue;
			String imageName = image.getName().toLowerCase();
			if (imageName.startsWith("preview")) {
				DataHandleUtils.optimizePreviewImage(image, outFolder);
			} else {
				DataHandleUtils.optimizeDetailImage(image, outFolder);
			}
		}
	}
}
