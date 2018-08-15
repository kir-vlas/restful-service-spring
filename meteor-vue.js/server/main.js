import { Meteor } from 'meteor/meteor';

Meteor.methods({
    loadArticles: function(){
        const result = HTTP.call('GET','http://localhost:8080/api/articles');
        return result;
    },
    createArticle: function(newArticle){
        HTTP.call('POST','http://localhost:8080/api/articles',{data: newArticle, headers:{'Content-Type': 'application/json'}})
    },
    editArticle: function(oldArticle,newArticle){
        HTTP.call('PUT', oldArticle._links.self.href,{
            data:newArticle,
            headers: {
                'Content-Type': 'application/json',
            }});
    },
    deleteArticle: function(article){
        HTTP.call('DELETE',article._links.self.href);
    }
});