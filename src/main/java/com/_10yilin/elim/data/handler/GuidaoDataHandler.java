package com._10yilin.elim.data.handler;

import java.io.File;

public class GuidaoDataHandler extends AbstractDataHandler {

	private DataHandler internalDataHandler = new LuomaganDataHandler();

	public void _process(File inFolder, File outFolder) {
		internalDataHandler.process(inFolder, outFolder);
	}

}
