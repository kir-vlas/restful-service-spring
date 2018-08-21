import {Meteor} from 'meteor/meteor';
import {Vue} from 'meteor/akryum:vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import App from '../imports/ui/app.vue';
import Header from '../imports/ui/header';
import Footer from '../imports/ui/footer';
import Article from '../imports/ui/article';
import Login from '../imports/ui/login';
import SignUp from '../imports/ui/signup';
import Edit from '../imports/ui/edit';

const router = new VueRouter({
    routes:[
        {path: '/login',name: 'login', component: Login, meta:{layout:'login'}},
        {path: '/sign-up', name: 'register', component: SignUp, meta: {layout:'sign-up'}},
        {path: '/', name: 'home', component: App , meta: {layout: 'main'}},
        {path: '/article/:id', name:'article', component: Article, meta: {layout:'article'}},
        {path: 'article/:id/edit', name:'edit', component: Edit, meta: {layout: 'edit'}}
    ]
})

Meteor.startup(() => {
    new Vue({router, render: h => h(App)}).$mount(document.getElementsByTagName('app')[0]);
    Vue.component('app-header', Header);
    Vue.component('app-footer', Footer);
    Vue.component('post', Article);
    Vue.component('login', Login);
    Vue.component('signup',SignUp);
    Vue.component('edit', Edit);
});
