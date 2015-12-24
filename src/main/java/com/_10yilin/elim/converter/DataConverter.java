package com._10yilin.elim.converter;

public interface DataConverter<F, T> {
	T convert(F from);
}
