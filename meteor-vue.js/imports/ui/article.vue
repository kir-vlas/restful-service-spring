<template>
    <div class="article">
        <router-link to="/">Back</router-link>
        <div v-if="user">
            <button v-if="user.username === 'admin' || user.username === articleAuthor.username" @click="removeArticle(article)" class="edit-button">Delete</button>
            <button v-if="user.username === 'admin' || user.username === articleAuthor.username" @click="editArticle(article)" class="edit-button">Edit</button>
        </div>
        <h5>author: {{article.author.username}}</h5>
        <h3>{{articleTitle}}</h3>
        <p>{{articleText}}</p>
        <hr/>
        <div v-if="articleComments" class="comment" v-for="comment of articleComments">
            <h3>Comments:</h3>
            <h4>{{comment.author.username}}</h4>
            <p v-if="!commentField">{{comment.commentText}}</p>
            <div class="comment-form-edit-container" v-else>
                <textarea v-model="newComment.commentText" class="comment-edit-body"></textarea>
                <button @click="editCommentSubmit" class="submit-button">Send</button>
            </div>
            <div v-if="user">
            <div v-if="user.username === 'admin' || user.username === comment.author.username">
                <a @click="editComment(comment)">edit</a>
                <a @click="removeComment(comment)">remove</a>
            </div>
            </div>
        </div>
        <div v-if="articleComments.length===0">
            <p>No comments</p>
        </div>
        <hr/>
        <div v-if="user" class="comment-form">
            <button @click="toggleComment">Comment</button>
            <div class="comment-form-container" v-show="commentFormToggle">
                <textarea v-model="newComment.commentText" class="comment-body"></textarea>
                <button @click="comment" class="submit-button">Send</button>
            </div>
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
                commentField:false,
                commentFormToggle:false,
                article:undefined,
                articleTitle:'',
                articleText:'',
                articleAuthor: undefined,
                articleComments:null,
                newComment: {
                    id:'',
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
                    id:'',
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
            editComment(comment){
                this.newComment.commentText = comment.commentText;
                this.commentField = !this.commentField;
                this.newComment.id = comment.id;
            },
            editCommentSubmit(){
                Meteor.call('editComment', this.article._id, this.newComment, (error, result) => {
                    if (error) throw error;
                    this.fetchData();
                });
                this.commentField = !this.commentField;
            },
            removeComment(comment){
                Meteor.call('removeComment', this.article._id, comment, (error, result) => {
                    if (error) throw error;
                    this.fetchData();
                })
            },
            toggleComment(){
                this.commentFormToggle = !this.commentFormToggle;
                this.newComment.commentText = '';
            },
            fetchData(){
                Meteor.call('loadArticleById',this.$route.params.id, (error,result) => {
                    this.article = result;
                    this.articleTitle = result.title;
                    this.articleText = result.textBody;
                    this.articleComments = result.comments;
                    this.articleAuthor = result.author;
                    this.commentFormToggle = false;
                    this.newComment = {
                        id:'',
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

    }

    .comment-form-container{
        height:250px;
        display:flex;
        flex-direction: column;
    }

    .comment-form-edit-container{
        display:flex;
        flex-direction: column;
        height:150px;
    }

    .comment-body{
        width:400px;
        height:200px;
    }

    .comment-edit-body{
        height:100px;
        width:400px;
    }

    .submit-button{
        height:40px;
        width:406px;
    }
</style>