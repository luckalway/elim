package com._10yilin.elim.data.handler;

import java.io.File;

public class GuidaoDataHandler extends AbstractDataHandler {

	private LuomaganDataHandler internalDataHandler = new LuomaganDataHandler();

	public void _process(File inFolder, File outFolder) {
		internalDataHandler._process(inFolder, outFolder);
	}

}
