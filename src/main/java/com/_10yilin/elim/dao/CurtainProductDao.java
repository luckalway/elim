package com._10yilin.elim.dao;

import java.util.List;

import com._10yilin.elim.entity.CurtainProduct;

public interface CurtainProductDao {
	public List<CurtainProduct> getAllProducts();

	public List<String> getRecommendProductIds();

}
