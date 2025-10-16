package com.weaver.weaver_api;

import org.springframework.boot.SpringApplication;

public class TestWeaverApiApplication {

	public static void main(String[] args) {
		SpringApplication.from(WeaverApiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
