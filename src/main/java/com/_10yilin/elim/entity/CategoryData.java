package com._10yilin.elim.entity;

import java.util.ArrayList;
import java.util.List;

public class CategoryData {
	private List<Category> styleCategories = new ArrayList<Category>();
	private List<Category> priceCategories = new ArrayList<Category>();
	private List<Category> clothCategories = new ArrayList<Category>();

	public List<Category> getStyleCategories() {
		return styleCategories;
	}

	public void setStyleCategories(List<Category> styleCategories) {
		this.styleCategories = styleCategories;
	}

	public List<Category> getPriceCategories() {
		return priceCategories;
	}

	public void setPriceCategories(List<Category> priceCategories) {
		this.priceCategories = priceCategories;
	}

	public List<Category> getClothCategories() {
		return clothCategories;
	}

	public void setClothCategories(List<Category> clothCategories) {
		this.clothCategories = clothCategories;
	}
}
