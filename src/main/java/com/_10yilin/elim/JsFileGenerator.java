package com._10yilin.elim;

import java.io.FileWriter;
import java.io.IOException;

import com._10yilin.elim.dao.CurtainProductDao;
import com._10yilin.elim.dao.SaleShowDao;
import com._10yilin.elim.dao.xml.CurtainProductDaoImpl;
import com._10yilin.elim.dao.xml.SaleShowDaoImpl;
import com._10yilin.elim.util.JsonUtils;

public class JsFileGenerator {

	private static CurtainProductDao curtainProductDao = new CurtainProductDaoImpl();
	private static SaleShowDao saleShowDao = new SaleShowDaoImpl();

	public static void main(String[] args) {
		try {
			FileWriter jsFileWriter = new FileWriter(Constants.FOLDER_OUTPUT_JS + "/data.js");
			jsFileWriter.write("var curtainItems=" + JsonUtils.toJson(curtainProductDao.getAllProducts()) + ";");
			System.out.println(JsonUtils.toJson(curtainProductDao.getAllProducts()));
			log("wrote curtain items to data.js");
			jsFileWriter.write("var recommendItemIds=" + JsonUtils.toJson(curtainProductDao.getRecommendProductIds())
					+ ";");
			log("wrote recommend items to data.js");
			jsFileWriter.write("var saleShows=" + JsonUtils.toJson(saleShowDao.getAllSaleShowList()) + ";");
			log("wrote sale shows to data.js");
			System.out.println(JsonUtils.toJson(saleShowDao.getAllSaleShowList()));

			jsFileWriter.flush();
			jsFileWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private static void log(String message) {
		System.out.println(message);
	}

}
