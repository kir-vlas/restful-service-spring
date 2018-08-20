import {Meteor} from 'meteor/meteor';
import {Vue} from 'meteor/akryum:vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import App from '../imports/ui/app.vue';
import Header from '../imports/ui/header';
import Footer from '../imports/ui/footer';
import Article from '../imports/ui/article';

const router = new VueRouter({
    routes:[
        {path: '/login',name: 'login', component: App, meta:{layout:'login'}},
        {path: '/sign-up', name: 'register', component: App, meta: {layout:'sign-up'}},
        {path: '/', name: 'home', component: App },
        {path: '/article/:id', name:'article', component: Article, meta: {layout:'article'}}
    ]
})

Meteor.startup(() => {
    new Vue({router, render: h => h(App)}).$mount(document.getElementsByTagName('app')[0]);
    Vue.component('app-header', Header);
    Vue.component('app-footer', Footer);
    Vue.component('post', Article);
});
