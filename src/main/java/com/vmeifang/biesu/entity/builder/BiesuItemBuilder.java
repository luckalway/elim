package com.vmeifang.biesu.entity.builder;

import com.vmeifang.biesu.entity.BiesuItem;

public class BiesuItemBuilder {
	private BiesuItem biesuItem;

	public BiesuItemBuilder() {
		this.biesuItem = new BiesuItem();
	}

	public BiesuItem getBiesuItem() {
		return this.biesuItem;
	}

	public void build(String code, String type, double width, double height) {

	}
}
