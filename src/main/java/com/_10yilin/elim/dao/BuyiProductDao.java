package com._10yilin.elim.dao;

import java.util.List;

import com._10yilin.elim.entity.BuyiProduct;

public interface BuyiProductDao {
	public List<BuyiProduct> getAllProducts();

	public List<String> getRecommendProductIds();

}
