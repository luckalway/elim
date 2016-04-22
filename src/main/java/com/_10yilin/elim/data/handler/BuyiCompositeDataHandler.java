package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Arrays;

public class BuyiCompositeDataHandler extends AbstractDataHandler {

	private BuYiDataHandler buYiDataHandler = new BuYiDataHandler();

	@Override
	void process(File inFolder, File outFolder) {
		for (File cateogry : inFolder.listFiles()) {
			buYiDataHandler.setCategory(getCategoryName(cateogry));
			for (File itemFolder : cateogry.listFiles()) {
				buYiDataHandler.handle(itemFolder, new File(outFolder, itemFolder.getName()));
			}
		}
	}

	private String getCategoryName(File cateogry) {
		String[] categoryNames = cateogry.list(new FilenameFilter() {
			public boolean accept(File dir, String name) {
				return name.endsWith(".txt");
			}
		});
		if (categoryNames.length != 1)
			throw new DataHandleException("Expected one but " + categoryNames.length + ", "
					+ Arrays.toString(categoryNames));

		return categoryNames[0];
	}

}
