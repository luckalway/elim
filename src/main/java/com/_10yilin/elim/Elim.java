package com._10yilin.elim;

import java.io.File;

import com._10yilin.elim.data.handler.GeneralDataHandler;
import com._10yilin.elim.data.handler.DataHandler;

public class Elim {
	private static DataHandler compositeDataHandler = new GeneralDataHandler();
	private static final String OUT_FOLDER = "C:\\Users\\malachi.ye\\git\\elim\\app\\data";
	private static final String IN_FOLDER = "G:\\elim\\data";

	public static void handeSourceData() {
		compositeDataHandler.init();
		compositeDataHandler.handle(new File(IN_FOLDER), new File(OUT_FOLDER));
	}

	public static void main(String[] args) {
		handeSourceData();
	}
}
