<template>
    <div class="edit-section">
        <input type="text" class="edit-title" v-model="newArticle.title" placeholder="Title"/>
        <textarea class="article-text" v-model="newArticle.textBody" placeholder="text"></textarea>
        <div class="edit-buttons">
            <button class="create-button edit-button" @click="editSubmit()">Send</button>
            <button class="create-button submit-button" @click="$router.go(-1)">Back</button>
        </div>
    </div>
</template>

<script>
    import {Meteor} from 'meteor/meteor';

    export default {
        name:'edit',
        data(){
            return{
                oldArticle:undefined,
                newArticle:{
                    _id:0,
                    title:'',
                    textBody:'',
                    author: undefined,
                    comments: undefined,
                    isPrivate: undefined
                }
            }
        },
        created(){
            Meteor.call('loadArticleById',this.$route.params.id, (error,result) => {
                this.oldArticle = result;
                this.newArticle = {
                    _id:result._id,
                    title: result.title,
                    textBody: result.textBody,
                    author:Meteor.user()
                };
                console.log(result);
                console.log(this.newArticle);
            });
        },
        methods:{
            editSubmit(){
                this.newArticle.author = this.oldArticle.author;
                this.newArticle.isPrivate = this.oldArticle.isPrivate;
                this.newArticle.comments = this.oldArticle.comments;
                Meteor.call("editArticle",this.newArticle);
                Meteor.call('loadArticles', (error,result) => {
                    if (error) throw error;
                    else this.$emit('update',result);
                    this.$router.go(-1);
                });

            }
        }
    }
</script>

<style>
    .edit-section{
        background-color: white;
        width:1200px;
        height:500px;
        padding:20px;
        box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    }

    .edit-section .edit-buttons{
        display: flex;
    }

    .edit-title{
        margin-bottom:10px;
    }

    .edit-section .edit-button{
        justify-self: flex-start;
        min-height: 60px;
        min-width: 150px;
    }
</style>