<template>
    <header @click="$router.push('/')">

    </header>
</template>

<script>
    export default {
        name: 'app-header'
    }
</script>

<style>
    header{
        height:80px;
        background-color: #b5fcff;
        padding:20px;
        display: flex;
        align-items: center;
    }
</style>
