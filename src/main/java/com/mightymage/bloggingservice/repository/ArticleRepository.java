package com.mightymage.bloggingservice.repository;

import com.mightymage.bloggingservice.entity.Article;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ArticleRepository extends PagingAndSortingRepository<Article, Integer> {

}
