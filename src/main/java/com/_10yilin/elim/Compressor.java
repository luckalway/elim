package com._10yilin.elim;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.log4j.Logger;
import org.imgscalr.Scalr;

public class Compressor {
	private static final Logger LOG = Logger.getLogger(Compressor.class);

	private static final File OUT_PUT_FOLDER = new File("G:\\demo");

	public static void main(String[] args) throws IOException {
		File folder = new File("G:\\BaiduYunDownload");
		check(folder);
	}

	private static void check(File folder) throws IOException {
		if (hasFile(folder, "flag")) {
			traverseProcess(folder);
			return;
		}

		for (File child : folder.listFiles()) {
			if (child.isFile()) {
				LOG.warn("No flag file found for the path[" + folder.getAbsolutePath() + "]");
				break;
			}
			check(child);
		}
	}

	private static void traverseProcess(File folder) throws IOException {
		for (File product : folder.listFiles()) {
			if (product.isFile())
				continue;

			LOG.info("Start process product:" + product.getName());
			for (File model : product.listFiles()) {
				File target = new File(OUT_PUT_FOLDER, product.getName() + "/" + model.getName());
				target.mkdirs();

				LOG.info("Start process model:" + model.getName());
				for (File image : model.listFiles()) {
					BufferedImage scaledImage = Scalr.resize(ImageIO.read(image), 750);
					ImageIO.write(scaledImage, "jpg", new File(target, image.getName()));
				}
			}
		}
	}

	public static boolean hasFile(File folder, String fileName) {
		return new File(folder, fileName).exists();
	}
}
