package com.mightymage.bloggingservice.repository;

import com.mightymage.bloggingservice.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ArticleRepository extends JpaRepository<Article, Integer> {

}
