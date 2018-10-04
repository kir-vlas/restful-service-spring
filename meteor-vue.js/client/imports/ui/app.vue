<template>
    <div id="body">
        <app-header></app-header>
        <main>
            <login :par-user="currentUser"
                   @update="afterLogin"
                   v-if="$route.meta.layout === 'login'">
            </login>
            <signup :par-user="currentUser"
                    @update="afterLogin"
                    v-if="$route.meta.layout === 'sign-up'">
            </signup>
            <div class="sub-header">
                <div class="logged-in" v-if="currentUser">
                    <span>Welcome, <router-link :to="{name:'user', params: {username:currentUser.username} }">{{currentUser.username}}</router-link></span>
                    <button @click="logout()" class="create-button header-button"><span class="header-button-text">Logout</span>
                    </button>
                </div>
                <div class="anonymous" v-else>
                    <a @click="login">Sign In</a>
                    <a @click="signup">Sign Up</a>
                </div>
            </div>
            <user-profile v-if="$route.meta.layout === 'userprofile'"></user-profile>
            <div class="articles-main"
                 v-if="$route.meta.layout === 'main'">
                <paginate name="articles"
                          :list="articles"
                          :per="5">
                    <div v-for="article of paginated('articles')">
                        <div class="article-card"
                             :title="article.title"
                             v-if="!article.isPrivate">
                            <div style="display: inline-flex;">
                                <h2 class="article-header"
                                    @click="goTo(article._id)">{{article.title}}
                                </h2>
                                <div class="edit-buttons"
                                     v-if="currentUser">
                                    <button v-if="currentUser.username === 'admin'"
                                            @click="deleteArticle(article)"
                                            class="create-button edit-button"><span
                                            class="edit-button-text">Delete</span>
                                    </button>
                                    <button v-if="currentUser.username === 'admin'"
                                            @click="editArticle(article)"
                                            class="create-button edit-button"><span class="edit-button-text">Edit</span>
                                    </button>
                                </div>
                            </div>
                            <h5 class="article-author">Author: {{article.author.username}}</h5>
                            <span class="article-text">{{article.textBody.length > 2500
                                    ? article.textBody.substr(0, 2500).concat('...')
                                    : article.textBody}}</span>
                        </div>
                        <div v-else-if="currentUser">
                            <div class="article-card private-article"
                                 :title="article.title"
                                 @click="goTo(article._id)"
                                 v-if="currentUser.username === article.author.username">
                                <button v-if="currentUser.username === 'admin'"
                                        @click="deleteArticle(article)"
                                        class="edit-button">Delete
                                </button>
                                <button v-if="currentUser.username === 'admin'"
                                        @click="editArticle(article)"
                                        class="edit-button">Edit
                                </button>
                                <h2 class="article-header">{{article.title}}</h2>
                                <h5 class="article-author">Author: {{article.author.username}}</h5>
                                <span class="article-text">{{article.textBody.length > 200
                                    ? article.textBody.substr(0,200).concat('...')
                                    : article.textBody}}
                                </span>
                            </div>
                        </div>
                    </div>
                </paginate>
                <paginate-links class="page-links" for="articles" :simple="{
                next: ' Next »',
                prev: '« Back '
            }"></paginate-links>
            </div>
            <edit :art="articles"
                  @update="afterChange"
                  v-if="$route.meta.layout === 'edit'"
                  class="edit-container">
            </edit>
            <post :art="articles"
                  @update="afterChange"
                  v-if="$route.meta.layout === 'article'">
            </post>
            <button class="create-button"
                    v-if="currentUser
                    && $route.meta.layout === 'main'"
                    @click="showCreateForm()">
                <span class="init-text">Create Article</span>
            </button>
            <div class="create-form" v-show="createFormVisible">
                <input type="text" v-model="newArticle.title" placeholder="Title"/>
                <textarea class="article-text" v-model="newArticle.textBody" placeholder="text"></textarea>
                <span class="danger"
                      v-if="errorLabel">
                        Missing fields or too much letters in article
                    </span>
                <span class="create-form-elements">
                    <button class="create-button"
                            @click="createArticle(article)">
                        <span class="submit-text">Send</span></button>
                    <button class="create-button"
                            @click="showCreateForm">
                        <span class="submit-text">Cancel</span>
                    </button>
                    <span>
                        <input type="checkbox"
                               title="Private"
                               v-model="newArticle.isPrivate">
                        Private
                    </span>
            </span>
            </div>
        </main>
        <app-footer></app-footer>
    </div>
</template>

<script>

  //TODO more fields for users
  //TODO admin panel with registered users
  //TODO suspend and ban users
  //TODO register new administrators
  //TODO verify e-mail
  //TODO Sign-Up password validation
  //TODO attach pictures to articles
  //TODO comments tree

  import {Meteor} from 'meteor/meteor';

  import appHeader from './appheader';
  import appFooter from './appfooter';

  export default {
    name: 'app',
    components: {
      appHeader,
      appFooter,
    },
    data() {
      return {
        formVisible: false,
        createFormVisible: false,
        errorLabel: false,
        isLoggedIn: false,
        articles: [],
        paginate: ['articles'],
        newArticle: {
          title: '',
          textBody: '',
          author: '',
          isPrivate: false,
          comments: []
        },
        user: {
          username: '',
          password: ''
        },
        currentUser: null
      }
    },
    created() {
      Meteor.call("loadArticlesForUser", (error, result) => {
        if (error)
          throw new Meteor.error(error);

        this.articles = result.valueOf();
      });
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      showCreateForm() {
        this.errorLabel = false;
        this.newArticle.title = '';
        this.newArticle.textBody = '';
        this.createFormVisible = !this.createFormVisible;
      },
      debug() {
        this.newArticle.isPrivate = !this.newArticle.isPrivate;
      },
      createArticle() {
        if (!this.newArticle.title
            || !this.newArticle.textBody
            || (this.newArticle.textBody.length > 15000)) {
          this.errorLabel = true;
          return;
        }
        this.newArticle.author = Meteor.user();
        Meteor.call("createArticle", this.newArticle);
        this.fetchData();
      },
      editArticle(article) {
        this.$router.push({name: 'edit', params: {id: article._id}});
      },
      deleteArticle(article) {
        Meteor.call("deleteArticle", article);
        this.fetchData();
      },
      fetchData() {
        Meteor.call("loadArticlesForUser", (error, result) => {
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
              isPrivate: false,
              comments: []
            };
            this.currentUser = Meteor.user();
            console.log(this.currentUser);
          }
        });
      },
      login() {
        this.$router.push('/login');
      },
      signup() {
        this.$router.push('/sign-up');
      },
      logout() {
        Meteor.logout();
        this.$router.push('/');
        this.fetchData();
      },
      afterLogin(newU) {
        this.currentUser = newU;
        this.fetchData();
      },
      afterChange(newArticleCollection) {
        this.articles = newArticleCollection;
      },
      goTo(id) {
        this.$router.push({name: 'article', params: {id: id}});
      }
    }
  }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto');

    html {
        min-height: 100%;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
    }

    body {
        margin: 0px;
        font-family: 'Roboto';
        min-height: 100%;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        flex: auto;
    }

    #body {
        min-height: 100%;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        flex: auto;
    }

    main {
        min-height: 100%;
        background-color: #f1f1f1;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        flex: auto;
        align-items: center;
    }

    a {
        text-decoration: none;
    }

    a:visited {
        color: inherit;
    }


    .article-header {
        cursor: pointer;
        width: 1000px;
    }

    .article-text {
        min-height: 300px;
    }

    .danger {
        color: red;
    }

    .create-form {
        margin-top: 30px;
        width: 800px;
        height: 400px;
        position: fixed;
        padding: 10px;
        top: 500px;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
    }

    .create-form-elements {
        display: flex;
        display: -webkit-flex;
        justify-content: center;
    }

    ul.paginate-links li {
        text-decoration: none;
        display: inline;
        cursor: pointer;
    }

    .edit-button-text {
        padding: 12px 12px;
    }

    .edit-button {
        max-width: 100px;
        float: right;
        min-height: 25px;
        margin: 0;
    }

    .edit-buttons {
        width: 200px;
        z-index: 2;
    }

    .edit-container {
        display: flex;
        flex-wrap: wrap;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        width: 500px;
        height: 450px;
    }

    .sub-header {
        min-height: 50px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: flex-end;
        background-color: white;
        margin-bottom: 50px;
        width: 100%;
    }

    .logged-in {
        display: flex;
        display: -webkit-flex;
        width: 300px;
        justify-content: space-between;
        margin-right: 30px;
    }

    .logged-in span {
        line-height: 22px;
    }

    a:link {
        color: black;
    }

    .article-card {
        display: flex;
        flex-direction: column;
        height: 500px;
        background-color: white;
        padding: 25px;
        width: 1200px;
        margin: 40px;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);
    }

    .anonymous {
        cursor: pointer;
        display: flex;
        display: -webkit-flex;
        width: 150px;
        justify-content: space-between;
        margin-right: 30px;
    }

    .private-article .article-header {
        color: grey;
    }

    .articles-main .page-links {
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 80px;
    }

    .articles-main .page-links li a {
        background-color: #dbf1ff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);
        transition: background-color .3s;
    }

    .articles-main .page-links li a:hover {
        background-color: #d2e6f4;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3);
    }

    .articles-main ul {
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
    }

    .create-button {
        cursor: pointer;
        display: block;
        margin: 30px auto;
        padding: 0;
        min-height: 25px;
        overflow: hidden;
        border-width: 0;
        outline: none;
        border-radius: 2px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
        background-color: #dbf1ff;
        color: black;

        transition: background-color .3s;
    }

    .create-button .init-text {
        display: block;
        padding: 12px 48px;
    }

    .create-button .submit-text {
        display: block;
        padding: 6px 6px;
    }

    .create-button:hover, .create-button:focus {
        background-color: #d2e6f4;
    }

    .header-button {
        margin: 0;
    }

    .header-button-text {
        padding: 5px 10px;
    }

    .create-button:active:before {
        width: 120%;
        padding-top: 120%;

        transition: width .2s ease-out, padding-top .2s ease-out;
    }

</style>
