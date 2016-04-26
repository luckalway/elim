package com._10yilin.elim.util;

import java.io.File;
import java.io.IOException;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import org.apache.log4j.Logger;
import org.imgscalr.Scalr;

public class ImageUtils {
	private static final Logger LOG = Logger.getLogger(ImageUtils.class);

	private static final int IMAGE_WITH_BIGGEST = 800;
	private static final int IMAGE_WITH_MIDDLE = 410;
	private static final int IMAGE_WITH_SMALL = 280;
	private static final int IMAGE_WITH_SMALLER = 160;
	private static final int IMAGE_WITH_SMALLEST = 80;

	private static final String IMAGE_PATTERN = "([^\\s]+(\\.(?i)(jpg|png|gif|bmp))$)";
	private static Pattern PATTERN = Pattern.compile(IMAGE_PATTERN);

	public static boolean isImage(File image) {
		return PATTERN.matcher(image.getName()).matches();
	}

	public static void generateMutiSizeImages(File image, File outFolder, String imageName) throws IOException {
		File biggest = new File(outFolder, imageName);
		LOG.info("Start to process " + image);
		ImageIO.write(Scalr.resize(ImageIO.read(image), IMAGE_WITH_BIGGEST), "jpg", biggest);
		File middle = new File(outFolder, imageName + "_" + IMAGE_WITH_MIDDLE + ".jpg");
		ImageIO.write(Scalr.resize(ImageIO.read(biggest), IMAGE_WITH_MIDDLE), "jpg", middle);
		File small = new File(outFolder, imageName + "_" + IMAGE_WITH_SMALL + ".jpg");
		ImageIO.write(Scalr.resize(ImageIO.read(biggest), IMAGE_WITH_SMALL), "jpg", small);
		File smaller = new File(outFolder, imageName + "_" + IMAGE_WITH_SMALLER + ".jpg");
		ImageIO.write(Scalr.resize(ImageIO.read(biggest), IMAGE_WITH_SMALLER), "jpg", smaller);
		File smallest = new File(outFolder, imageName + "_" + IMAGE_WITH_SMALLEST + ".jpg");
		ImageIO.write(Scalr.resize(ImageIO.read(biggest), IMAGE_WITH_SMALLEST), "jpg", smallest);
		LOG.info("Generated mutiple size images of " + biggest);
	}

	public static String generateNormImageName(File folder) {
		SortedSet<String> sortedNames = new TreeSet<String>();
		for (String imageName : folder.list()) {
			if (Pattern.matches("[0-9]{3}\\.jpg", imageName)) {
				sortedNames.add(imageName);
			}
		}

		if (sortedNames.isEmpty())
			return "000.jpg";

		String maxImage = sortedNames.last();
		int index = Integer.parseInt(maxImage.substring(0, maxImage.indexOf(".")));
		index++;
		if (index < 10)
			return "00" + index + ".jpg";
		if (index < 100)
			return "0" + index + ".jpg";
		return "" + index + ".jpg";
	}
}
