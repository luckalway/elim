package com._10yilin.elim.data.handler;

public class DataHandleException extends RuntimeException {
	public DataHandleException(Exception e) {
		super(e);
	}

	public DataHandleException(String msg) {
		super(msg);
	}

	private static final long serialVersionUID = 5166683463742971904L;

}
