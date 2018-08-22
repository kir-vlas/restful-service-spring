<template>
    <div v-if="currentUser">
        <router-link to="/">Back.</router-link>
        <p>Username</p>
        <input type="text" readonly v-model="currentUser.username"/>
        <p v-if="currentUser.emails">E-mail: {{currentUser.emails[0].address}}</p>

    </div>
    <div v-else>
        You're not logged in. <router-link to="/">Back.</router-link>
    </div>
</template>

<script>
    export default {
        name:'userprofile',
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

</style>