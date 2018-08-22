import {Meteor} from 'meteor/meteor';
import {Vue} from 'meteor/akryum:vue';
import VueRouter from 'vue-router';
import VuePaginate from 'vue-paginate'
Vue.use(VueRouter);
Vue.use(VuePaginate);

import App from '../imports/ui/app.vue';
import AppHeader from '../imports/ui/appheader';
import AppFooter from '../imports/ui/appfooter';
import Article from '../imports/ui/article';
import Login from '../imports/ui/login';
import SignUp from '../imports/ui/signup';
import Edit from '../imports/ui/edit';
import UserProfile from '../imports/ui/userprofile';

const router = new VueRouter({
    routes:[
        {path: '/login',name: 'login', component: Login, meta:{layout:'login'}},
        {path: '/sign-up', name: 'register', component: SignUp, meta: {layout:'sign-up'}},
        {path: '/', name: 'home', component: App , meta: {layout: 'main'}},
        {path: '/article/:id', name:'article', component: Article, meta: {layout:'article'}},
        {path: '/article/:id/edit', name:'edit', component: Edit, meta: {layout: 'edit'}},
        {path: '/user/:username',name:'user', component: UserProfile, meta: {layout: 'userprofile'}}
    ]
})

Meteor.startup(() => {
    new Vue({router, render: h => h(App)}).$mount(document.getElementsByTagName('app')[0]);
    Vue.component('appheader', AppHeader);
    Vue.component('appfooter', AppFooter);
    Vue.component('post', Article);
    Vue.component('login', Login);
    Vue.component('signup',SignUp);
    Vue.component('edit', Edit);
    Vue.component('userprofile', UserProfile);
});
