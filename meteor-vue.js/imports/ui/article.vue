<template>
    <div class="article">
        <h3>{{articleTitle}}</h3>
        <p>{{articleText}}</p>
        <router-link to="/">Back</router-link>
    </div>
</template>

<script>
    export default {
        name: 'post',
        data(){
            return {
                articleTitle:'',
                articleText:''
            }
        },
        created(){
            console.log(this.$route.params.id);
            Meteor.call('loadArticleById',this.$route.params.id, (error,result) => {
                this.articleTitle = result.title;
                this.articleText = result.textBody;
            })
        },
        methods:{
            removeArticle(){
                throw Error("Not implemented");
            }
        }
    }
</script>