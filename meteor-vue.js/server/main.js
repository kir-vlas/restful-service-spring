import { Meteor } from 'meteor/meteor';
const mysql = require('sync-mysql');
let connection;

Meteor.startup(() =>{
    connection = new mysql({
        host: 'localhost',
        user: 'application-db',
        password: '123456',
        database: 'blogging-db'
    });
})

Meteor.methods({
    loadArticles: function(){
        let result = connection.query('SELECT * FROM `article`');
        connection._end();
        return result;
    },
    createArticle: function(newArticle){
        connection.query('INSERT INTO `article` (`text_body`, `title`) VALUES (?, ?)', [newArticle.text_body, newArticle.title]);
        connection._end();
    },
    editArticle: function(newArticle){
        connection.query('UPDATE `article` SET `title`=?, `text_body` = ? WHERE `id` = ?', [newArticle.title,newArticle.text_body,newArticle.id]);
        connection._end();
    },
    deleteArticle: function(article){
        connection.query('DELETE FROM `article` WHERE `id` = ?', [article.id]);
        connection._end();
    }
});