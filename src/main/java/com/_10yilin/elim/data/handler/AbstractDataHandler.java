package com._10yilin.elim.data.handler;

import java.io.File;

public abstract class AbstractDataHandler implements DataHandler {

	public void init() {

	}

	public void process(File inFolder, File outFolder) {
		if (outFolder.exists())
			outFolder.mkdirs();
		if (outFolder.isFile()) {
			outFolder.delete();
			outFolder.mkdirs();
		}
		_process(inFolder, outFolder);
	}

	abstract void _process(File inFolder, File outFolder);
}
