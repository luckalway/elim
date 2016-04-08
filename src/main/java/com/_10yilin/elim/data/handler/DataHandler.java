package com._10yilin.elim.data.handler;

import java.io.File;

public interface DataHandler {
	void init();

	void process(File inFolder, File outFolder);
}
