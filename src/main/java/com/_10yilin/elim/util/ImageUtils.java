package com._10yilin.elim.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;

import org.apache.log4j.Logger;

public class ImageUtils {
	private static final Logger LOG = Logger.getLogger(ImageUtils.class);

	public static boolean isImage(File image) {
		ImageInputStream is = null;
		try {
			return null != ImageIO.createImageInputStream(image);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			close(is);
		}
		return false;
	}

	private static void close(ImageInputStream is) {
		if (is != null)
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
	}

	public static void generateJPGImage(BufferedImage image, File outFolder, String imageName) throws IOException {
		generateJPGImage(image, new File(outFolder, imageName));
	}

	public static void generateJPGImage(BufferedImage scaledImage, File outputFile) throws IOException {
		ImageIO.write(scaledImage, "jpg", outputFile);
		LOG.info("Generated an image with path " + outputFile);
	}

	public static String generateNormImageName(File folder) {
		int max = 0;
		for (String subFolder : folder.list()) {
			int index = 0;
			try {
				index = Integer.parseInt(subFolder.substring(0, subFolder.indexOf(".")));
			} catch (NumberFormatException e) {

			}
			if (max < index) {
				max = index;
			}
		}
		int index = max + 1;
		if (index < 10)
			return "00" + index + ".jpg";
		if (index < 100)
			return "0" + index + ".jpg";
		return "" + index + ".jpg";
	}
}
