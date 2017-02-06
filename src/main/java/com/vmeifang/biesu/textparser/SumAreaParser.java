package com.vmeifang.biesu.textparser;

import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.vmeifang.biesu.entity.BiesuItem;
import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public class SumAreaParser implements TextParser {
	private static final Log LOG = LogFactory.getLog(FloorParser.class);

	private static final String REG_EXP = "建筑.*面积.*平米";
	private static Pattern PATTERN = Pattern.compile(REG_EXP);

	public boolean support(String inputText) {
		boolean matched = PATTERN.matcher(inputText).find();
		if (!matched) {
			LOG.info("Can not parse " + inputText);
		}
		return matched;
	}

	public BiesuItem prase(BiesuItemBuilder builder, String inputText) {
		return null;
	}

}
