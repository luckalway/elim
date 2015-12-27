package com._10yilin.elim.entity;

import java.util.Date;
import java.util.List;

public class SaleShow {
	private String id;
	private String description;
	private String title;
	private String previewImage;
	private Date date;

	private List<String> moreImages;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getPreviewImage() {
		return previewImage;
	}

	public void setPreviewImage(String previewImage) {
		this.previewImage = previewImage;
	}

	public List<String> getMoreImages() {
		return moreImages;
	}

	public void setMoreImages(List<String> moreImages) {
		this.moreImages = moreImages;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

}
