package com._10yilin.elim.util;

import com.google.gson.Gson;

public class JsonUtils {
	public static String toJson(Object obj) {
		if (obj == null)
			throw new IllegalArgumentException("obj must not be null.");

		Gson gson = new Gson();
		return gson.toJson(obj);
	}
}
