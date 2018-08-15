import {Meteor} from 'meteor/meteor';
import {Vue} from 'meteor/akryum:vue';

import App from '../imports/ui/app.vue';

Meteor.startup(() => {
    new Vue(App).$mount(document.body);
});
