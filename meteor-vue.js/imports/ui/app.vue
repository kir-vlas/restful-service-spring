<template>
    <div>
        <app-header></app-header>
        <main>
        <login :par-user="currentUser" @update="afterLogin" v-if="$route.meta.layout === 'login'"></login>
        <signup :par-user="currentUser" @update="afterLogin" v-if="$route.meta.layout === 'sign-up'"></signup>
        <div class="under-header">
            <span v-if="currentUser">Welcome, {{currentUser.username}}<button @click="logout()">Logout</button></span>
            <span v-else>
                <a @click="login">Login</a>
                <a @click="signup">Sign Up</a>
            </span>
        </div>
        <div v-if="articles && $route.meta.layout === 'main'" v-for="article of articles">
            <div v-if="currentUser">
                <button v-if="currentUser.username === 'admin'" @click="deleteArticle(article)" class="edit-button">Delete</button>
                <button v-if="currentUser.username === 'admin'" @click="editArticle(article)" class="edit-button">Edit</button>
            </div>
            <h3><router-link :to="{name:'article', params: {id:article._id} }">{{article.title}}</router-link></h3>
            <hr/>
        </div>
        <edit :art="articles" @update="afterChange" v-if="$route.meta.layout === 'edit'" class="edit-container"></edit>
        <div v-if="articles.length===0">
            <h2>No articles found!</h2>
        </div>
        <post :art="articles" @update="afterChange" v-if="$route.meta.layout === 'article'"></post>
        <button v-if="currentUser && $route.meta.layout === 'main'" @click="showCreateForm()">Create Article</button>
        <div class="create-form" v-show="createFormVisible">
            <input type="text" v-model="newArticle.title" placeholder="Title"/>
            <textarea class="article-text" v-model="newArticle.textBody" placeholder="text"></textarea>
            <button @click="createArticle(article)">Send</button>
        </div>
        </main>
        <app-footer></app-footer>
    </div>
</template>

<script>

    //TODO edit and delete comments
    //TODO pagination and sorting
    //TODO user profile page
    //TODO pre-moderate post public articles
    //TODO private articles

    import {Meteor} from 'meteor/meteor';

    export default {
        data(){
            return {
                formVisible: false,
                createFormVisible: false,
                errorLabel: false,
                articles: [],
                newArticle:{
                    title:'',
                    textBody:'',
                    author:'',
                    comments: []
                },
                user:{
                    username:'',
                    password:''
                },
                currentUser: null
            }
        },
        created(){
            console.log(Meteor.user());
            Meteor.call("loadArticles", (error, result) => {
                this.articles = result.valueOf();
            });
        },
        mounted(){
            this.fetchData();
        },
        methods:{
            showCreateForm(){
                this.createFormVisible = !this.createFormVisible;
            },
            createArticle(){
                this.newArticle.author = Meteor.user();
                Meteor.call("createArticle", this.newArticle);
                this.fetchData();
            },
            editArticle(article){
                this.$router.push({name: 'edit', params: {id:article._id}});
            },
            deleteArticle(article){
                Meteor.call("deleteArticle",article);
                this.fetchData();
            },
            fetchData(){
                Meteor.call("loadArticles", (error, result) => {
                    if (error) throw error;
                    else {
                        this.articles = result.valueOf();
                        this.formVisible = false;
                        this.errorLabel = false;
                        this.createFormVisible = false;
                        this.newArticle = {
                            title: '',
                            textBody: '',
                            author: '',
                            comments:[]
                        };
                        this.currentUser = Meteor.user();
                        console.log(this.currentUser);
                    }
                });
            },
            login(){
                this.$router.push('/login');
            },
            signup(){
                this.$router.push('/sign-up');
            },
            logout(){
                Meteor.logout();
                this.fetchData();
            },
            afterLogin(newU){
                this.currentUser = newU;
            },
            afterChange(newArticleCollection){
                this.articles = newArticleCollection;
            }
        }

}
</script>

<style>
    body{
        margin: 0px;
        font-family: Arial;
    }

    a{
        text-decoration: none;
    }

    a:visited{
        color:black;
    }
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

    .close{
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .under-header{
        height:30px;
    }
</style>
