package com._10yilin.elim.util;

public class CommonUtils {
	public static String getPrefix(String full) {
		if (full.indexOf(".") == 0)
			return full;
		return full.substring(0, full.indexOf("."));
	}
}
