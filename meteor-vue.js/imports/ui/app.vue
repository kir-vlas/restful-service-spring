<template>
    <div>
        <app-header></app-header>

        <main>
        <div v-if="$route.meta.layout === 'login'">
            <div v-if="!currentUser" class="login-box">
                <span class="close"><a href="/#/">X</a></span>
                <h2>Login</h2>
                <div>
                    <span v-if="errorLabel" class="error-label">Wrong username/password</span>
                    <p>Username: <input placeholder="username" v-model="user.username" type="text"/></p>
                    <p>Password: <input @keyup.enter="loginUser()" placeholder="password" v-model="user.password" type="password"/></p>
                    <button @click="loginUser()">Login</button>
                </div>
            </div>
        </div>
        <div v-if="$route.meta.layout === 'sign-up'">
            <div class="login-box">
                <span class="close"><a href="/#/">X</a></span>
                <h2>Register</h2>
                <div>
                    <p>Username: <input placeholder="username" v-model="user.username" type="text"/></p>
                    <p>Password: <input @keyup.enter="registerUser()" placeholder="password" v-model="user.password" type="password"/></p>
                    <button @click="registerUser()">Sign up</button>
                </div>

            </div>
        </div>
        <div class="under-header">
            <span v-if="currentUser">Welcome, {{currentUser.username}}<button @click="logout()">Logout</button></span>
            <span v-else>
                <a href="/#/login">Login</a>
                <a href="/#/sign-up">Sign Up</a>
            </span>
        </div>
        <div v-if="articles && $route.meta.layout !== 'article'" v-for="article of articles">
            <div v-if="currentUser">
                <button v-if="currentUser.username === 'admin'" @click="deleteArticle(article)" class="edit-button">Delete</button>
                <button v-if="currentUser.username === 'admin'" @click="editArticle(article)" class="edit-button">Edit</button>
            </div>
            <h3><router-link :to="{name:'article', params: {id:article._id} }">{{article.title}}</router-link></h3>
            <div v-if="formVisible" class="edit-container">
                <input type="text" v-model="newArticle.title" placeholder="Title"/>
                <textarea class="article-text" v-model="newArticle.textBody" placeholder="text"></textarea>
                <button @click="editSubmit()">Send</button>
            </div>
            <hr/>
        </div>
        <div v-if="articles.length===0">
            <h2>No articles found!</h2>
        </div>
        <post v-if="$route.meta.layout === 'article'"></post>
        <button v-if="currentUser" @click="showCreateForm()">Create Article</button>
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

    //TODO Make options for article page
    //TODO Add cookie and sessions for signed in users
    //TODO comments for public articles
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
                    author:''
                },
                user:{
                    username:'',
                    password:''
                },
                currentUser: null
            }
        },
        created(){
            Meteor.call("loadArticles", (error, result) => {
                this.articles = result.valueOf();
            });
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
                this.formVisible = !this.formVisible;
                this.newArticle = {
                    _id: article._id,
                    title: article.title,
                    textBody: article.textBody,
                    author: Meteor.user()
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
                    this.errorLabel = false;
                    this.createFormVisible = false;
                    this.newArticle = {
                        title: '',
                        textBody: '',
                        author:''
                    };
                    this.currentUser = Meteor.user();
                });
            },
            loginUser(){
                Meteor.loginWithPassword(this.user.username,this.user.password, (error) => {
                    if (error) {
                        this.errorLabel = true;
                    }
                    else {
                        this.fetchData();
                        this.user = {
                            username: '',
                            password: ''
                        };
                        this.$router.push('/');
                    }
                });
            },
            registerUser(){
                Accounts.createUser(this.user,(error) => {
                    if (error) throw error;
                    else {
                        this.fetchData();
                        this.user = {
                            username: '',
                            password: ''
                        }
                        this.$router.push('/');
                    }
                });
            },
            logout(){
                Meteor.logout();
                this.fetchData();
            }
        }

}
</script>

<style>
    body{
        margin: 0px;
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
    .login-box{
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        width:300px;
        height:250px;
        border: 1px solid black;
    }
    .close{
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .under-header{
        height:30px;
    }

    .error-label{
        color:red;
    }
</style>
