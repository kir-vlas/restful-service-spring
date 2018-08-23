import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo'
import { Random } from 'meteor/random'

const articles = new Mongo.Collection('articles');

Meteor.startup(() =>{

});

Meteor.methods({
    loadArticles: function(){
        const result = articles.find({}).fetch();
        return result;
    },
    loadArticleById:function(id){
        const result = articles.findOne({_id:id});
        return result;
    },
    createArticle: function(newArticle){
        articles.insert(newArticle);
    },
    editArticle: function(newArticle){
        if (Roles.userIsInRole(Meteor.user(), ['admin']) || newArticle.author._id === Meteor.user()._id) {
            articles.update({_id: newArticle._id}, {title: newArticle.title, textBody: newArticle.textBody,author:newArticle.author, comments: newArticle.comments, isPrivate: newArticle.isPrivate});
        }
        else throw Error('Wrong user');
    },
    commentArticle: function(articleId, comment){
        comment.id = Random.id();
        articles.update(articleId, {$push: {comments: comment}});
    },
    editComment: function(articleId, newComment){
        newComment.author = Meteor.user();
        articles.update(articleId, {$pull: {comments: {id: {$eq: newComment.id}}}});
        articles.update(articleId, {$push: {comments: newComment}});
    },
    removeComment: function(articleId, delComment){
        articles.update(articleId, {$pull: {comments: {id: {$eq: delComment.id}}}});
    },
    deleteArticle: function(article){
        if (Roles.userIsInRole(Meteor.user(), ['admin']) || article.author._id === Meteor.user()._id)
            articles.remove(article._id);
        else throw Error();
    }
});