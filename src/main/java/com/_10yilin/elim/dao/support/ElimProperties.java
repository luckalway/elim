package com._10yilin.elim.dao.support;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

public class ElimProperties {
	private Map<String, String> properties = new HashMap<String, String>();

	public ElimProperties(File file) {
		BufferedReader bufferedReader = null;
		try {
			bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
			String line = null;
			do {
				line = bufferedReader.readLine();
				if (StringUtils.isNotEmpty(line)) {
					String[] pair = line.trim().split("=");
					properties.put(pair[0].trim().toLowerCase(), pair[1].trim());
				}
			} while (line != null);
		} catch (IOException e) {
			throw new IllegalArgumentException(e);
		} finally {
			if (bufferedReader != null) {
				try {
					bufferedReader.close();
				} catch (IOException e) {
					throw new IllegalArgumentException(e);
				}
			}
		}
	}

	public String getString(String key) {
		return properties.get(key.toLowerCase());
	}

}
