package com._10yilin.elim.data.handler;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

public class CompositeDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(CompositeDataHandler.class);

	private Map<String, DataHandler> dataHandlers = new HashMap<String, DataHandler>();

	public void init() {
		LOG.info("CompositeDataHandler initializing");
		registerDataHandler("baiye", new BaiyeDataHandler());
		registerDataHandler("buyi", new BuyiDataHandler());
		registerDataHandler("peijian", new PeijianDataHandler());
		registerDataHandler("promotion", new PromotionDataHandler());
		registerDataHandler("sold-show", new SoldShowDataHandler());
		LOG.info("CompositeDataHandler initialized finished");
	}

	private void registerDataHandler(String name, DataHandler dataHandler) {
		dataHandler.init();
		dataHandlers.put(name, dataHandler);
		LOG.info("Registred dataHandler<" + name + ", " + dataHandler.getClass().getSimpleName() + ">");
	}

	public void _process(File inFolder, File outFolder) {
		if (dataHandlers.isEmpty())
			throw new DataHandleException("No DataHandler available");

		for (File folder : inFolder.listFiles()) {
			if (dataHandlers.containsKey(folder.getName())) {
				DataHandler dataHandler = dataHandlers.get(folder.getName());
				dataHandler.process(folder, outFolder);
			} else {
				LOG.warn("Cannot find a DataHander for the folder " + folder.getAbsolutePath());
			}
		}
	}

}
