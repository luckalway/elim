package com._10yilin.elim.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;

public class ImageUtils {

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

	public static void generateJPGImage(BufferedImage image, File outputFolder, String imageName) throws IOException {
		ImageIO.write(image, "jpg", new File(outputFolder, imageName));
	}

	public static void generateJPGImage(BufferedImage scaledImage, File outputFile) throws IOException {
		ImageIO.write(scaledImage, "jpg", outputFile);
	}

}
