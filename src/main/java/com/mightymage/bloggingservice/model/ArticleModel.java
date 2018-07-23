package com.mightymage.bloggingservice.model;

import lombok.Getter;
import lombok.Setter;

public class ArticleModel {
    private @Getter @Setter int id;
    private @Getter @Setter String title;
    private @Getter @Setter String text;

    private ArticleModel() {}

    public ArticleModel(ArticleModel article){
        this.id = article.id;
        this.text = article.text;
        this.title = article.title;
    }

    public ArticleModel(int id, String title, String text) {
        this.id = id;
        this.title = title;
        this.text = text;
    }
}
