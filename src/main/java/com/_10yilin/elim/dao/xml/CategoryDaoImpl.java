package com._10yilin.elim.dao.xml;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import com._10yilin.elim.Constants;
import com._10yilin.elim.dao.CategoryDao;
import com._10yilin.elim.entity.Category;
import com._10yilin.elim.entity.CategoryData;

public class CategoryDaoImpl implements CategoryDao {
	private String CATEGORY_XML = Constants.BASE_DATA + "/category.xml";

	public CategoryData getCategoryData() {
		CategoryData categoryData = new CategoryData();
		SAXBuilder builder = new SAXBuilder();
		try {
			Document document = builder.build(new FileInputStream(CATEGORY_XML));
			loadSubCategories(document.getRootElement().getChild("style"), categoryData.getStyleCategories());
			loadSubCategories(document.getRootElement().getChild("price"), categoryData.getPriceCategories());
			loadSubCategories(document.getRootElement().getChild("cloth"), categoryData.getClothCategories());
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return categoryData;
	}

	private void loadSubCategories(Element priceRoot, List<Category> categoriesStore) {
		for (Element price : priceRoot.getChildren()) {
			Category category = new Category();
			category.setId(price.getAttributeValue("id"));
			category.setName(price.getText());
			categoriesStore.add(category);
		}
	}
}
