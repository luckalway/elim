package com._10yilin.elim.data.handler;

import java.io.File;

public class GuidaoDataHandler extends AbstractDataHandler {

	private LuomaganDataHandler internalDataHandler = new LuomaganDataHandler();

	public void process(File inFolder, File outFolder) {
		internalDataHandler.process(inFolder, outFolder);
	}

}
