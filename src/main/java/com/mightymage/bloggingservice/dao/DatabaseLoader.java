package com.mightymage.bloggingservice.dao;

import com.mightymage.bloggingservice.entity.Article;
import com.mightymage.bloggingservice.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final ArticleRepository repository;

    @Autowired
    public DatabaseLoader(ArticleRepository repository){
        this.repository = repository;
    }

    @Override
    public void run(String...strings) throws Exception{
        this.repository.save(new Article("First title of my new blog!", "Hey there! " +
                "Today you can see my first blogarticle in my first blog in my first blogging service! Let's go dude!"));
    }
}
