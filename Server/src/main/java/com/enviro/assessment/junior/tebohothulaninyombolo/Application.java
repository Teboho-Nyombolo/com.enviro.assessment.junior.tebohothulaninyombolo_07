package com.enviro.assessment.junior.tebohothulaninyombolo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.enviro.assessment.junior.tebohothulaninyombolo.entity")
@EnableJpaRepositories(basePackages = "com.enviro.assessment.junior.tebohothulaninyombolo.repository")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("+++++ Application started +++++");
    }

}
