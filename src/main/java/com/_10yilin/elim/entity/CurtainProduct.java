package com._10yilin.elim.entity;

import java.util.List;
import java.util.Map;

public class CurtainProduct {
	private String id;
	private String title;
	private double price;
	private int shadingPercent;
	private String material;
	private String style;
	private String colors;

	public Map<String, List<String>> galleryGroups;
	public List<String> previewImages;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getShadingPercent() {
		return shadingPercent;
	}

	public void setShadingPercent(int shadingPercent) {
		this.shadingPercent = shadingPercent;
	}

	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	public Map<String, List<String>> getGalleryGroups() {
		return galleryGroups;
	}

	public void setGalleryGroups(Map<String, List<String>> galleryGroups) {
		this.galleryGroups = galleryGroups;
	}

	public List<String> getPreviewImages() {
		return previewImages;
	}

	public void setPreviewImages(List<String> previewImages) {
		this.previewImages = previewImages;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getColors() {
		return colors;
	}

	public void setColors(String colors) {
		this.colors = colors;
	}

}
