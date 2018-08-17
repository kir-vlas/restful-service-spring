import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo'

const articles = new Mongo.Collection('articles');

Meteor.startup(() =>{

});

Meteor.methods({
    loadArticles: function(){
        const result = articles.find({}).fetch();
        return result;
    },
    createArticle: function(newArticle){
        articles.insert(newArticle);
    },
    editArticle: function(newArticle){
        articles.update({_id:newArticle._id},{title:newArticle.title,textBody:newArticle.textBody});
    },
    deleteArticle: function(article){
        articles.remove(article._id);
    }
});