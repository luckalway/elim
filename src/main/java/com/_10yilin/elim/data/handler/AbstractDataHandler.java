package com._10yilin.elim.data.handler;

import java.io.File;
import java.io.IOException;

import org.apache.log4j.Logger;

public abstract class AbstractDataHandler implements DataHandler {
	private static final String DONE_FLAG = "done.flag";
	private static final Logger LOG = Logger.getLogger(AbstractDataHandler.class);

	public void init() {

	}

	public void process(File inFolder, File outFolder) {
		if (precheck(inFolder, outFolder)) {
			LOG.info("Start process: " + inFolder.getName());
			beforeHandle(outFolder);
			_process(inFolder, outFolder);
			afterHandle(inFolder, outFolder);
			LOG.info("Processed finished, out to " + outFolder);
		}
	}

	private void beforeHandle(File outFolder) {
		if (!outFolder.exists()) {
			outFolder.mkdirs();
			LOG.info("Created a folder with path " + outFolder.getAbsolutePath());
		}
		if (outFolder.isFile()) {
			outFolder.delete();
			outFolder.mkdirs();
			LOG.info("Created a folder with path " + outFolder.getAbsolutePath());
		}
	}

	private void afterHandle(File inFolder, File outFolder) {
		try {
			new File(inFolder, DONE_FLAG).createNewFile();
		} catch (IOException e) {
			throw new DataHandleException(e);
		}
	}

	abstract void _process(File inFolder, File outFolder);

	protected boolean precheck(File inFolder, File outFolder) {
		if (isProcessed(inFolder))
			return false;

		if (!inFolder.exists())
			throw new DataHandleException("Can not found the folder[" + inFolder.getAbsolutePath() + "]");
		if (inFolder.isFile())
			throw new DataHandleException(inFolder.getAbsolutePath()
					+ " is a file type that shouldn't appear in current location");

		return true;
	}

	protected boolean isProcessed(File inFile) {
		return new File(inFile, DONE_FLAG).exists();
	}

}
