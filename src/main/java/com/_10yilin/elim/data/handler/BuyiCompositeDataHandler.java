package com._10yilin.elim.data.handler;

import java.io.File;

import com._10yilin.elim.dao.support.ElimProperties;

public class BuyiCompositeDataHandler extends AbstractDataHandler {

	private BuYiDataHandler buYiDataHandler = new BuYiDataHandler();

	@Override
	void process(File inFolder, File outFolder) {
		for (File cateogry : inFolder.listFiles()) {
			ElimProperties properties = new ElimProperties(new File(cateogry, "info.txt"));
			buYiDataHandler.setCraft(properties.getString("craft"));
			System.out.println(properties.getString("craft"));
			buYiDataHandler.setMaterial(properties.getString("material"));
			for (File itemFolder : cateogry.listFiles()) {
				buYiDataHandler.handle(itemFolder, new File(outFolder, itemFolder.getName()));
			}
		}
	}

}
