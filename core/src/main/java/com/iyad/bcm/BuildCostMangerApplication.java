package com.iyad.bcm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.iyad.model")
@EnableJpaRepositories("com.iyad.repository")
@ComponentScan("com.iyad")
public class BuildCostMangerApplication {

	public static void main(String[] args) {
		SpringApplication.run(BuildCostMangerApplication.class, args);
	}

}
