import {Meteor} from 'meteor/meteor';
import {Vue} from 'meteor/akryum:vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import App from '../imports/ui/app.vue';
import Header from '../imports/ui/header';
import Footer from '../imports/ui/footer';

const router = new VueRouter({
    routes:[
        {path: '/login',name: 'login', component: App, meta:{layout:'login'}},
        {path: '/sign-up', name: 'register', component: App, meta: {layout:'sign-up'}},
        {path: '/', name: 'home', component: App}
    ]
})

Meteor.startup(() => {
    new Vue({router, render: h => h(App)}).$mount(document.getElementsByTagName('app')[0]);
    new Vue(Header).$mount(document.getElementsByTagName('header')[0]);
    new Vue(Footer).$mount(document.getElementsByTagName('footer')[0]);
});
