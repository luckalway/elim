package com._10yilin.elim.data.handler;

import java.io.File;

import org.apache.log4j.Logger;

public class PeijianDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(PeijianDataHandler.class);

	public void _process(File inFolder, File outFolder) {
		LOG.info("Start processing");
		for (File folder : inFolder.listFiles()) {
			DataHandler dataHandler = getDataHandler(folder);
			if (dataHandler == null) {
				throw new DataHandleException("Can not find a DataHander for the folder " + inFolder.getAbsolutePath());
			}
			dataHandler.process(inFolder, new File(outFolder, inFolder.getName()));
		}
		LOG.info("Processed finished");
	}

	private DataHandler getDataHandler(File folder) {
		if (folder.equals("guidao")) {
			return new GuidaoDataHandler();
		} else if (folder.equals("luomagan")) {
			return new LuomaganDataHandler();
		}
		return null;
	}

}
