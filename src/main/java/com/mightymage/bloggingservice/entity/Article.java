package com.mightymage.bloggingservice.entity;

import lombok.Data;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

//TODO add another columns

@Entity
@Data
@Table(name="article")
public class Article {
    private @Id @GeneratedValue(strategy=GenerationType.AUTO) @Column(name="id") int id;
    private @Column(name="title") String title;
    private @Column(name="textBody") String textBody;

    private @Transient @Version @JsonIgnore Long version;

    private Article () {}

    public Article (String title, String text){
        this.title = title;
        this.textBody = text;
    }
}
