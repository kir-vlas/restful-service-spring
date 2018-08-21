<template>
    <div v-if="!currentUser" class="login-box">
        <span class="close"><a @click="$router.go(-1)">X</a></span>
        <h2>Login</h2>
        <div>
            <span v-if="errorLabel" class="error-label">Wrong username/password</span>
            <p>Username: <input placeholder="username" v-model="user.username" type="text"/></p>
            <p>Password: <input @keyup.enter="loginUser()" placeholder="password" v-model="user.password" type="password"/></p>
            <button @click="loginUser()">Login</button>
        </div>
    </div>
</template>

<script>
    import {Meteor} from 'meteor/meteor';

    export default{
        name: 'login',
        props: ['par-user'],
        data(){
            return {
                errorLabel: false,
                user: {
                    username:undefined,
                    password:undefined
                }
            };
        },
        created(){

        },
        methods:{
            loginUser(){
                Meteor.loginWithPassword(this.user.username,this.user.password, (error) => {
                    if (error) {
                        this.errorLabel = true;
                    }
                    else {
                        this.errorLabel = false;
                        this.user = {
                            username: '',
                            password: ''
                        };
                        this.$emit('update',Meteor.user());
                        this.$router.go(-1);
                    }
                });
            }
        }
    }
</script>

<style>
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

    .error-label{
        color:red;
    }
</style>