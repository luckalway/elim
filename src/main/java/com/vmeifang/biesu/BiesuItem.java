package com.vmeifang.biesu;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BiesuItem {
	private String id;
	private String type;
	private int countOfFloor;
	private Map<Integer, List<String>> roomsMap = new HashMap<Integer, List<String>>();
	private double width;
	private double height;
	private String description;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getCountOfFloor() {
		return countOfFloor;
	}

	public void setCountOfFloor(int countOfFloor) {
		this.countOfFloor = countOfFloor;
	}

	public Map<Integer, List<String>> getRoomsMap() {
		return roomsMap;
	}

	public void setRoomsMap(Map<Integer, List<String>> roomsMap) {
		this.roomsMap = roomsMap;
	}

	public double getWidth() {
		return width;
	}

	public void setWidth(double width) {
		this.width = width;
	}

	public double getHeight() {
		return height;
	}

	public void setHeight(double height) {
		this.height = height;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
