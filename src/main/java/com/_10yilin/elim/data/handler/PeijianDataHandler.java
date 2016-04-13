package com._10yilin.elim.data.handler;

import java.io.File;

public class PeijianDataHandler extends AbstractDataHandler {

	public void _process(File inFolder, File outFolder) {
		for (File subFolder : inFolder.listFiles()) {
			DataHandler dataHandler = getDataHandler(subFolder);
			if (dataHandler == null) {
				throw new DataHandleException("Can not find a DataHander for the folder " + subFolder.getAbsolutePath());
			}
			dataHandler.process(subFolder, outFolder);
		}
	}

	private DataHandler getDataHandler(File folder) {
		if (folder.getName().equals("guidao")) {
			return new CollectionDataHandler(new GuidaoDataHandler());
		} else if (folder.getName().equals("luomagan")) {
			return new CollectionDataHandler(new LuomaganDataHandler());
		}
		return null;
	}

}
