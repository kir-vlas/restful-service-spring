package com.mightymage.bloggingservice.repository;

import com.mightymage.bloggingservice.entity.Article;
import org.springframework.data.repository.CrudRepository;

public interface ArticleRepository extends CrudRepository<Article, Integer> {

}
