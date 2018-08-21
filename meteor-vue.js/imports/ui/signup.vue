<template>
    <div class="login-box">
        <span class="close"><a @click="$router.go(-1)">X</a></span>
        <h2>Sign Up</h2>
        <div>
            <p>Username: <input placeholder="username" v-model="user.username" type="text"/></p>
            <p>Password: <input @keyup.enter="registerUser()" placeholder="password" v-model="user.password" type="password"/></p>
            <button @click="registerUser()">Sign up</button>
        </div>
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
        width:300px;
        height:250px;
        border: 1px solid black;
    }

    .error-label{
        color:red;
    }
</style>