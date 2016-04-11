package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;

import org.apache.log4j.Logger;

public abstract class AbstractDataHandler implements DataHandler {
	private static final Logger LOG = Logger.getLogger(AbstractDataHandler.class);

	public void init() {

	}

	public void process(File inFolder, File outFolder) {
		outFolder = new File(outFolder, inFolder.getName());
		if (!outFolder.exists()) {
			outFolder.mkdirs();
			LOG.info("Created a folder with path " + outFolder.getAbsolutePath());
		}
		if (outFolder.isFile()) {
			outFolder.delete();
			outFolder.mkdirs();
			LOG.info("Created a folder with path " + outFolder.getAbsolutePath());
		}
		_process(inFolder, outFolder);
	}

	abstract void _process(File inFolder, File outFolder);

	protected void checkIfDirectory(File inFolder, File baiyeFolder) {
		if (baiyeFolder.isFile()) {
			throw new DataHandleException("This one is a file type that shouldn't appear in "
					+ inFolder.getAbsolutePath() + ": " + baiyeFolder.getName());
		}
	}

	protected void checkIfExitPreview(File inFolder) {
		if (!new File(inFolder, "preview.jpg").exists())
			throw new DataHandleException("Preview image is not exist in " + inFolder.getAbsolutePath());
	}

	protected void markFinished(File inFile) throws IOException {
		new File(inFile, "process.flag").createNewFile();
	}

	protected boolean isProcessed(File inFile) {
		return new File(inFile, "process.flag").exists();
	}

}
