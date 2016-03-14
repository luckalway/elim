package com._10yilin.elim;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.imgscalr.Scalr;

public class Constants {
	public static final String BASE_URL = "";

	public static final String PROJECT_HOME = "C:/Users/malachi.ye/git/elim/";

	public static final String FOLDER_OUTPUT_JS = PROJECT_HOME + "app/data.js";

	public static final String FOLDER_CURTAIN_DATA = "app/data/curtain";

	public static final String FOLDER_SALE_SHOW_DATA = "app/data/sale-show";

	public static final String FOLDER_SLIDE = "app/data/promotion/slide";
	
	public static void main(String[] args) throws IOException {
		File input = new File("G:\\BaiduYunDownload\\阳离子遮光布\\m-131\\m-131-1\\IMG_8161.JPG");
		BufferedImage image = ImageIO.read(input);
		BufferedImage scaledImage = Scalr.resize(image, 750);
		ImageIO.write(scaledImage, "jpg", new File("G:\\BaiduYunDownload\\阳离子遮光布\\m-131\\m-131-1\\000.jpg"));
	}
}
