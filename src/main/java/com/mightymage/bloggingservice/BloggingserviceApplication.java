package com.mightymage.bloggingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class BloggingserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloggingserviceApplication.class, args);
    }
}
