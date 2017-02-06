package com.vmeifang.biesu.textparser;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.vmeifang.biesu.entity.BiesuItem;
import com.vmeifang.biesu.entity.builder.BiesuItemBuilder;

public class FloorParser implements TextParser {
	private static final Log LOG = LogFactory.getLog(FloorParser.class);

	private static Map<String, Integer> FLOORS_MAP = new HashMap<String, Integer>();

	private static final String REG_EXP = "本户型.*层.*别墅";
	private static Pattern PATTERN = Pattern.compile(REG_EXP);

	public boolean support(String inputText) {
		boolean matched = PATTERN.matcher(inputText).find();
		if (!matched) {
			LOG.info("Can not get floor info from " + inputText);
		}
		return matched;
	}

	public BiesuItem prase(BiesuItemBuilder builder, String inputText) {
		Matcher matcher = PATTERN.matcher(inputText);
		if (matcher.find()) {
			String matchedText = matcher.group();
			int pos = matchedText.indexOf("层");
			String floor = matchedText.substring(pos - 1, pos - 1);
			//item.setCountOfFloor(FLOORS_MAP.get(floor));
		}
		return null;
	}

}
