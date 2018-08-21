<template>
    <div>
        <input type="text" v-model="newArticle.title" placeholder="Title"/>
        <textarea class="article-text" v-model="newArticle.textBody" placeholder="text"></textarea>
        <button @click="editSubmit()">Send</button>
        <a @click="$router.go(-1)">Back</a>
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
                    title:'',
                    textBody:'',
                    author: undefined
                }
            }
        },
        created(){
            Meteor.call('loadArticleById',this.$route.params.id, (error,result) => {
                this.oldArticle = result;
                this.newArticle = {
                    _id: result._id,
                    title: result.title,
                    textBody: result.textBody,
                    author: Meteor.user()
                }
            });
        },
        methods:{
            editSubmit(){
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

</style>