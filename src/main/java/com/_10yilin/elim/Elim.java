package com._10yilin.elim;

import java.io.File;

import com._10yilin.elim.data.handler.CompositeDataHandler;
import com._10yilin.elim.data.handler.DataHandler;

public class Elim {
	private static DataHandler compositeDataHandler = new CompositeDataHandler();
	private static final String OUT_FOLDER = "C:\\Users\\malachi.ye\\git\\elim\\app";
	private static final String IN_FOLDER = "G:\\elim\\data";

	public static void handeSourceData() {
		compositeDataHandler.init();
		compositeDataHandler.process(new File(IN_FOLDER), new File(OUT_FOLDER));
	}

	public static void main(String[] args) {
		handeSourceData();
	}
}
