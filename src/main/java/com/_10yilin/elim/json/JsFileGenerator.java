package com._10yilin.elim.json;

import java.io.FileWriter;
import java.io.IOException;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.CategoryDao;
import com._10yilin.elim.dao.CurtainProductDao;
import com._10yilin.elim.dao.GuidaoDao;
import com._10yilin.elim.dao.LuomaganDao;
import com._10yilin.elim.dao.SaleShowDao;
import com._10yilin.elim.dao.SlideItemDao;
import com._10yilin.elim.dao.SlideItemDaoImpl;
import com._10yilin.elim.dao.xml.CategoryDaoImpl;
import com._10yilin.elim.dao.xml.CurtainProductDaoImpl;
import com._10yilin.elim.dao.xml.GuidaoDaoImpl;
import com._10yilin.elim.dao.xml.LuomaganDaoImpl;
import com._10yilin.elim.dao.xml.SaleShowDaoImpl;
import com._10yilin.elim.util.JsonUtils;

public class JsFileGenerator {

	private static CurtainProductDao curtainProductDao = new CurtainProductDaoImpl();
	private static SaleShowDao saleShowDao = new SaleShowDaoImpl();
	private static SlideItemDao slideItemDao = new SlideItemDaoImpl();
	private static CategoryDao categoryDao = new CategoryDaoImpl();
	private static GuidaoDao guidaoDao = new GuidaoDaoImpl();
	private static LuomaganDao luomaganDao = new LuomaganDaoImpl();

	public static void main(String[] args) {
		try {
			FileWriter jsFileWriter = new FileWriter(Constants.FOLDER_OUTPUT_JS);
			jsFileWriter.write("var curtainItems=" + JsonUtils.toJson(curtainProductDao.getAllProducts()) + ";");
			log("wrote curtain items to data.js");
			jsFileWriter.write("var recommendItemIds=" + JsonUtils.toJson(curtainProductDao.getRecommendProductIds())
					+ ";");
			log("wrote recommend items to data.js");
			jsFileWriter.write("var saleShows=" + JsonUtils.toJson(saleShowDao.getAllSaleShowList()) + ";");
			log("wrote sale shows to data.js");

			jsFileWriter.write("var slideShows=" + JsonUtils.toJson(slideItemDao.getAllSlideItems()) + ";");

			jsFileWriter.write("var categoryObj=" + JsonUtils.toJson(categoryDao.getCategoryData()) + ";");
			log("wrote categories to data.js");

			jsFileWriter.write("var guidaos=" + JsonUtils.toJson(guidaoDao.getGuidaos()) + ";");
			jsFileWriter.write("var luomagans=" + JsonUtils.toJson(luomaganDao.getLuomagans()) + ";");

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
