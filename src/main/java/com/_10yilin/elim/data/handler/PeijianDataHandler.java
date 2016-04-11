package com._10yilin.elim.data.handler;

import java.io.File;

import org.apache.log4j.Logger;

public class PeijianDataHandler extends AbstractDataHandler {
	private static final Logger LOG = Logger.getLogger(PeijianDataHandler.class);

	public void _process(File inFolder, File outFolder) {
		LOG.info("Start process " + inFolder.getAbsolutePath());
		for (File folder : inFolder.listFiles()) {
			DataHandler dataHandler = getDataHandler(folder);
			if (dataHandler == null) {
				throw new DataHandleException("Can not find a DataHander for the folder " + folder.getAbsolutePath());
			}
			dataHandler.process(folder, outFolder);
		}
		LOG.info("Processed finished, out to " + outFolder.getAbsolutePath());
	}

	private DataHandler getDataHandler(File folder) {
		if (folder.getName().equals("guidao")) {
			return new GuidaoDataHandler();
		} else if (folder.getName().equals("luomagan")) {
			return new LuomaganDataHandler();
		}
		return null;
	}

}
