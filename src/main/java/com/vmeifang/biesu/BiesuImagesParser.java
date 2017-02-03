package com.vmeifang.biesu;

import java.io.File;

public class BiesuImagesParser {
	private static final File ROOT = new File("F:\\beisu\\data\\Part01-245套精选各种房型自建房CAD配效果图\\01-- 精选245套各种房型别墅CAD配效果图");

	public static void main(String[] args) {
		System.out.println(ROOT.list().length);
	}

}
