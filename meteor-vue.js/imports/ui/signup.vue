<template>
    <div v-if="!currentUser" class="login-box">
        <div @click="$router.go(-1)" class="close"></div>
        <h2>Sign Up</h2>
        <div class="md-input">
            <input class="md-text-field" required title="Username" v-model="user.username" type="text"/>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label>Username</label>
        </div>
        <div class="md-input">
            <input class="md-text-field" required title="Password" v-model="user.password" type="password"/>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label>Password</label>
        </div>
        <span v-if="errorLabel" class="error-label">Please, enter username and password</span>
        <button class="create-button login-button" @click="registerUser()"><span class="login-button-text">Sign Up</span></button>
    </div>
</template>

<script>
    export default{
        name: 'signup',
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
            registerUser(){
                if (!(this.user.username && this.user.password)){
                    this.errorLabel = true;
                    throw Error('Not valid credentials');
                }
                Accounts.createUser(this.user,(error) => {
                    if (error) throw error;
                    else {
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
    }

    .error-label{
        color:red;
    }
</style>