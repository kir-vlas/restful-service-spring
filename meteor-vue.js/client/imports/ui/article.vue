<template>
    <div class="article">
        <div>
            <router-link to="/">Back</router-link>
        </div>
        <div v-if="user">
            <button v-if="user.username === 'admin' || user.username === articleAuthor.username"
                    @click="removeArticle(article)" class="create-button edit-button"><span class="edit-button-text">Delete</span>
            </button>
            <button v-if="user.username === 'admin' || user.username === articleAuthor.username"
                    @click="editArticle(article)" class="create-button edit-button"><span
                    class="edit-button-text">Edit</span></button>
        </div>
        <h5>By: {{article.author.username}}</h5>
        <h1 class="article-title">{{articleTitle}}</h1>
        <p class="article-body">{{articleText}}</p>
        <div class="comment-section">
            <div v-if="articleComments" class="comment" v-for="comment of articleComments">
                <h4>{{comment.author.username}}</h4>
                <p v-if="commentField || !(editCommentId === comment.id)">{{comment.commentText}}</p>
                <div class="comment-form-edit-container" v-else>
                    <textarea v-model="newComment.commentText" class="comment-edit-body"></textarea>
                    <button @click="editCommentSubmit" class="create-button submit-button">Send</button>
                </div>
                <div v-if="user">
                    <div class="comment-options" v-if="user.username === 'admin' || user.username === comment.author.username">
                        <a @click="editComment(comment)">edit</a>
                        <a @click="removeComment(comment)">remove</a>
                    </div>
                </div>
            </div>
            <div v-if="articleComments.length===0">
                <p>No comments</p>
            </div>
            <div v-if="user" class="comment-form">
                <button class="create-button comment-button" @click="toggleComment">Comment</button>
                <div class="comment-form-container" v-show="commentFormToggle">
                    <textarea v-model="newComment.commentText" class="comment-body"></textarea>
                    <button @click="comment" class="create-button submit-button">Send</button>
                </div>
            </div>
            <div v-else>
                <p>Only registered users can leave comments.</p>
            </div>
        </div>
    </div>
</template>

<script>
  import {Meteor} from 'meteor/meteor';

  export default {
    name: 'post',
    props: ['art'],
    data() {
      return {
        commentField: true,
        editCommentId: 0,
        commentFormToggle: false,
        article: undefined,
        articleTitle: '',
        articleText: '',
        articleAuthor: undefined,
        articleComments: null,
        newComment: {
          id: '',
          commentText: '',
          author: null
        },
        user: null
      }
    },
    created() {
      Meteor.call('loadArticleById', this.$route.params.id, (error, result) => {
        this.article = result;
        this.articleTitle = result.title;
        this.articleText = result.textBody;
        this.articleComments = result.comments;
        this.articleAuthor = result.author;
        this.newComment = {
          id: '',
          commentText: '',
          author: null
        }
      });
      this.user = Meteor.user();
    },
    methods: {
      editArticle() {
        this.$router.push({name: 'edit', params: {id: this.$route.params.id}});
      },
      removeArticle() {
        Meteor.call("deleteArticle", this.article);
        Meteor.call('loadArticles', (error, result) => {
          if (error) throw error;
          else this.$emit('update', result);
          this.$router.push("/")
        });
      },
      comment() {
        this.newComment.author = Meteor.user();
        Meteor.call('commentArticle', this.article._id, this.newComment, (error, result) => {
          if (error) throw error;
          this.fetchData();
        })
      },
      editComment(comment) {
        this.editCommentId = comment.id;
        this.newComment.commentText = comment.commentText;
        this.commentField = !this.commentField;
        this.newComment.id = comment.id;
      },
      editCommentSubmit() {
        Meteor.call('editComment', this.article._id, this.newComment, (error, result) => {
          if (error) throw error;
          this.fetchData();
        });
        this.commentField = !this.commentField;
      },
      removeComment(comment) {
        Meteor.call('removeComment', this.article._id, comment, (error, result) => {
          if (error) throw error;
          this.fetchData();
        })
      },
      toggleComment() {
        this.commentFormToggle = !this.commentFormToggle;
        this.newComment.commentText = '';
      },
      fetchData() {
        Meteor.call('loadArticleById', this.$route.params.id, (error, result) => {
          this.article = result;
          this.articleTitle = result.title;
          this.editCommentId = 0;
          this.articleText = result.textBody;
          this.articleComments = result.comments;
          this.articleAuthor = result.author;
          this.commentFormToggle = false;
          this.newComment = {
            id: '',
            commentText: '',
            author: undefined
          }
        });
        this.user = Meteor.user();
      }
    }
  }
</script>

<style>
    .article {
        padding: 30px;
        width: 1200px;

        background-color: white;
        box-shadow: 0 15px 15px rgba(0, 0, 0, .6);
        margin-bottom: 80px;
    }

    .article-title {
        margin-left: 40px;
    }

    .article-body {
        font-size: 1.25rem;
        min-height: 300px;
    }

    .comment {
        padding: 10px;
        margin: 20px 0px;
        background-color: #f6f7ff;
    }

    .comment-form {

    }

    .comment-options {
        display: flex;
        justify-content: space-between;
        width: 100px;
    }

    .comment-options a {
        cursor: pointer;
    }

    .comment-section {
        border-top: 1px solid gray;
    }

    .comment-button {
        margin: initial;
        padding: 12px;
    }

    .comment-form-container {
        padding: 15px;
        background-color: #f6f7ff;
        margin-top: 20px;
        height: 250px;
        display: flex;
        flex-direction: column;
    }

    .comment-form-edit-container {
        display: flex;
        flex-direction: column;
        height: 100px;
    }

    .comment-body {
        width: 800px;
        height: 200px;
    }

    .comment-edit-body {
        height: 100px;
        width: 800px;
    }

    .submit-button {
        margin: initial;
        margin-top: 10px;
        height: 40px;
        width: 80px;
    }

</style>
