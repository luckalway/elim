package com._10yilin.elim.data.handler;

import java.io.File;

public class CollectionDataHandler extends AbstractDataHandler {

	private DataHandler dataHandler = null;

	public CollectionDataHandler(DataHandler dataHandler) {
		this.dataHandler = dataHandler;
	}

	public void process(File inFolder, File outFolder) {
		for (File product : inFolder.listFiles()) {
			dataHandler.handle(product, new File(outFolder, product.getName()));
		}
	}

}
