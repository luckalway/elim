package com._10yilin.elim.dao;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com._10yilin.elim.Constants;
import com._10yilin.elim.entity.SlideItem;
import com._10yilin.elim.util.CommonUtils;

public class SlideItemDaoImpl implements SlideItemDao {

	private File folder = null;

	public SlideItemDaoImpl() {
		this.folder = new File(Constants.PROJECT_HOME + Constants.FOLDER_SLIDE);
	}

	public List<SlideItem> getAllSlideItems() {
		List<SlideItem> items = new ArrayList<SlideItem>();

		for (String imageName : folder.list()) {
			SlideItem slideItem = new SlideItem();
			slideItem.setId(CommonUtils.getPrefix(imageName));
			slideItem.setImage(Constants.BASE_URL + Constants.FOLDER_SLIDE + "/" + imageName);
			items.add(slideItem);
		}

		return items;
	}

}
