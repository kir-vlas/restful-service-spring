<template>
    <div class="user-box" v-if="currentUser">
        <p>Username
        <input type="text" readonly v-model="currentUser.username"/></p>
        <p v-if="currentUser.emails">E-mail: {{currentUser.emails[0].address}}</p>
        <button class="create-button submit-button" @click="$router.go(-1)">Back</button>
    </div>
    <div class="user-box" v-else>
        You're not logged in. <router-link to="/">Back.</router-link>
    </div>
</template>

<script>
    export default {
        name:'user-profile',
        data(){
            return {
                currentUser: null
            }
        },
        created(){
            this.currentUser = Meteor.user();
        }
    }
</script>

<style>
    .user-box{
        width:800px;
        height:400px;
        padding:40px;
        background-color: white;
        box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    }
</style>
