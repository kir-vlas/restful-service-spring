package com.mightymage.bloggingservice.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Article {
    private @Id @GeneratedValue int id;
    private String title;
    private String textBody;

    private @Version @JsonIgnore Long version;

    private Article () {}

    public Article (String title, String text){
        this.title = title;
        this.textBody = text;
    }
}
