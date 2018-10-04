<template>
    <div v-if="!this.$parent.currentUser" class="login-box">
        <div @click="$router.go(-1)" class="close"></div>
        <h2>Sign In</h2>
        <div class="md-input">
            <input class="md-text-field" required title="Username" v-model="user.username" type="text"/>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label>Username</label>
        </div>
        <div class="md-input">
            <input class="md-text-field" required @keyup.enter="loginUser()" title="Password" v-model="user.password"
                   type="password"/>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label>Password</label>
        </div>
        <span v-if="errorLabel" class="error-label">Wrong username/password</span>
        <button class="create-button login-button" @click="loginUser()"><span class="login-button-text">Login</span>
        </button>
    </div>
</template>

<script>
  import {Meteor} from 'meteor/meteor';

  export default {
    name: 'login',
    props: ['par-user'],
    data() {
      return {
        errorLabel: false,
        user: {
          username: null,
          password: null
        }
      };
    },
    created() {

    },
    methods: {
      loginUser() {
        if (!(this.user.username && this.user.password)) {
          this.errorLabel = true;
          throw Error('Not valid credentials');
        }
        Meteor.loginWithPassword(this.user.username, this.user.password, (error) => {
          if (error) {
            this.errorLabel = true;
          }
          else {
            this.errorLabel = false;
            this.user = {
              username: '',
              password: ''
            };
            this.$emit('update', Meteor.user());
            this.$router.go(-1);
          }
        });
      }
    }
  }
</script>

<style>
    .login-box {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 50%;
        padding: 5px;
        align-items: center;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        width: 400px;
        height: 250px;
        box-shadow: 0 5px 5px rgba(0, 0, 0, .6);
    }

    .error-label {
        color: red;
        position: absolute;
        margin-top: 170px;
    }

    .login-button {
        min-height: 30px;
    }

    .login-button-text {
        padding: 32px 24px;
    }

    .close {
        justify-content: center;
        display: flex;
        align-self: flex-end;
        width: 24px;
        min-height: 24px;
        opacity: 0.5;
        transition: opacity .2s;
    }

    .close:hover {
        opacity: 1;
    }

    .close:before, .close:after {
        position: absolute;
        content: ' ';
        height: 24px;
        width: 1px;
        background-color: #333;
    }

    .close:before {
        transform: rotate(45deg);
    }

    .close:after {
        transform: rotate(-45deg);
    }

    .md-input {
        margin: 10px;
        position: relative;
    }

    .md-input .md-text-field {
        display: block;
        width: 300px;
        border: none;
        color: black;
        font-size: 16px;
        border-bottom: 1px solid #abc0ce;
    }

    .md-input .md-text-field:focus {
        outline: none;
    }

    .md-input .highlight {

    }

    .md-input .bar {
        position: relative;
        display: block;
        width: 300px;
    }

    .md-input .bar:before, .bar:after {
        content: '';
        height: 2px;
        width: 0;
        bottom: 0px;
        position: absolute;
        background: #92a4b1;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
    }

    .md-input .bar:before {
        left: 50%;
    }

    .md-input .bar:after {
        right: 50%;
    }

    .md-input label {
        position: absolute;
        color: rgba(47, 47, 47, 0.5);
        font-size: 16px;
        font-weight: normal;
        pointer-events: none;
        top: -4px;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
    }

    .md-input .md-text-field:hover ~ label {
        color: black;
    }

    .md-input .md-text-field:focus ~ label {
        color: black;
        top: -16px;
        font-size: 12px;
    }

    .md-input .md-text-field:valid ~ label {
        color: black;
        top: -16px;
        font-size: 12px;
    }

    .md-input .md-text-field:focus ~ .bar:before, .md-text-field:focus ~ .bar:after {
        width: 50%;
    }

    .md-input .highlight {
        position: absolute;
        height: 60%;
        width: 100px;
        top: 25%;
        left: 0;
        pointer-events: none;
        opacity: 0.5;
    }

    .md-input .md-text-field:focus ~ .highlight {
        -webkit-animation: inputHighlighter 0.3s ease;
        -moz-animation: inputHighlighter 0.3s ease;
        animation: inputHighlighter 0.3s ease;
    }
</style>
