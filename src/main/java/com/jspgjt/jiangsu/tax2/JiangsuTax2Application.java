package com.jspgjt.jiangsu.tax2;

import com.jspgjt.jiangsu.tax2.util.SimpleJpaRepositoryImpl;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

//@EnableJpaRepositories(value = "com.jspgjt.jiangsu.tax2.repository", repositoryBaseClass = SimpleJpaRepositoryImpl.class)
@SpringBootApplication
public class JiangsuTax2Application {

    public static void main(String[] args) {
        SpringApplication.run(JiangsuTax2Application.class, args);
    }

}
