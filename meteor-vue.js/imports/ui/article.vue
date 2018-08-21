<template>
    <div class="article">
        <router-link to="/">Back</router-link>
        <div v-if="user">
            <button v-if="user.username === 'admin' || user.username === articleAuthor.username" @click="removeArticle(article)" class="edit-button">Delete</button>
            <button v-if="user.username === 'admin' || user.username === articleAuthor.username" @click="editArticle(article)" class="edit-button">Edit</button>
        </div>
        <h3>{{articleTitle}}</h3>
        <p>{{articleText}}</p>
        <hr/>
        <div class="comment" v-for="comment of articleComments">
            <h4>{{comment.author.username}}</h4>
            <p>{{comment.commentText}}</p>
        </div>
        <hr/>
        <div v-if="user" class="comment-form">
            <textarea v-model="newComment.commentText" class="comment-body"></textarea>
            <button @click="comment" class="submit-button">Send</button>
        </div>
        <div v-else>
            <p>Only registered users can comment articles.</p>
        </div>
    </div>
</template>

<script>
    import {Meteor} from 'meteor/meteor';

    export default {
        name: 'post',
        props: ['art'],
        data(){
            return {
                article:undefined,
                articleTitle:'',
                articleText:'',
                articleAuthor: undefined,
                articleComments:null,
                newComment: {
                    commentText: '',
                    author: undefined
                },
                user: null
            }
        },
        created(){
            Meteor.call('loadArticleById',this.$route.params.id, (error,result) => {
                this.article = result;
                this.articleTitle = result.title;
                this.articleText = result.textBody;
                this.articleComments = result.comments;
                this.articleAuthor = result.author;
                this.newComment = {
                    commentText:'',
                    author:undefined
                }
            });
            this.user = Meteor.user();
        },
        methods:{
            editArticle(){
                this.$router.push({name: 'edit', params: {id:this.$route.params.id}});
            },
            removeArticle(){
                Meteor.call("deleteArticle",this.article);
                Meteor.call('loadArticles', (error,result) => {
                    if (error) throw error;
                    else this.$emit('update',result);
                    this.$router.push("/")
                });
            },
            comment(){
                this.newComment.author = Meteor.user();
                Meteor.call('commentArticle', this.article._id, this.newComment, (error, result) => {
                    if (error) throw error;
                    this.fetchData();
                })
            },
            fetchData(){
                Meteor.call('loadArticleById',this.$route.params.id, (error,result) => {
                    this.article = result;
                    this.articleTitle = result.title;
                    this.articleText = result.textBody;
                    this.articleComments = result.comments;
                    this.articleAuthor = result.author;
                    this.newComment = {
                        commentText:'',
                        author:undefined
                    }
                });
                this.user = Meteor.user();
            }
        }
    }
</script>

<style>
    .comment{

    }

    .comment-form{
        display:flex;
        flex-direction: column;
    }

    .comment-body{
        width:400px;
        height:200px;
    }

    .submit-button{
        height:40px;
        width:406px;
    }
</style>