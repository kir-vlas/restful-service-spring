<template>
    <div class="app">
        <div v-for="article of articles">
            <button @click="deleteArticle(article)" class="edit-button">Delete</button>
            <button @click="editArticle(article)" class="edit-button">Edit</button>
            <h3>{{article.title}}</h3>
            <p>{{article.text_body}}</p>
            <div v-if="formVisible" class="edit-container">
                <input type="text" v-model="newArticle.title" placeholder="Title"/>
                <textarea class="article-text" v-model="newArticle.text_body" placeholder="text"></textarea>
                <button @click="editSubmit()">Send</button>
            </div>
            <hr/>
        </div>
        <button @click="showCreateForm()">Create Article</button>
        <div class="create-form" v-show="createFormVisible">
            <input type="text" v-model="newArticle.title" placeholder="Title"/>
            <textarea class="article-text" v-model="newArticle.text_body" placeholder="text"></textarea>
            <button @click="createArticle(article)">Send</button>
        </div>
    </div>
</template>

<script>
    import {Meteor} from 'meteor/meteor';

    export default {
        data(){
            return {
                formVisible: false,
                createFormVisible: false,
                articles: [],
                newArticle:{
                    id:0,
                    title:'',
                    text_body:''
                }
            }
        },
        created(){
            let tmp;
            Meteor.call("loadArticles", (error, result) => {
                this.articles = result.valueOf();
            });
        },
        methods:{
            showCreateForm(){
                this.createFormVisible = !this.createFormVisible;
            },
            createArticle(){
                Meteor.call("createArticle", this.newArticle);
                this.fetchData();
            },
            editArticle(article){
                this.formVisible = !this.formVisible;
                this.newArticle = {
                    id:article.id,
                    title: article.title,
                    text_body: article.text_body
                }
            },
            editSubmit(){
                Meteor.call("editArticle",this.newArticle);
                this.fetchData();
            },
            deleteArticle(article){
                Meteor.call("deleteArticle",article);
                this.fetchData();
            },
            fetchData(){
                Meteor.call("loadArticles", (error, result) => {
                    this.articles = result.valueOf();
                    this.formVisible = false;
                    this.createFormVisible = false;
                    this.newArticle = {
                        id:0,
                        title: '',
                        text_body: ''
                    }
                });
            }
        }

}
</script>

<style>
    .article-text{
        height:300px;
    }

    .create-form{
        margin-top: 30px;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
    }

    .edit-button{
        float:right;
    }
    .edit-container{
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        width: 500px;
        height:450px;
    }
</style>
