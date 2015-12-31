package com._10yilin.elim.dao;

import java.util.List;

import com._10yilin.elim.entity.Category;

public interface CategoryDao {
	List<Category> getStyleCategories();

	List<Category> getPriceCategories();

	List<Category> getClothCategories();

}
