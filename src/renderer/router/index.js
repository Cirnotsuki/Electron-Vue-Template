import Vue from '../modules/vue/index';
import Router from '../modules/vue-router/index';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: require('@/components/LandingPage').default,
        },
        {
            path: '*',
            redirect: '/',
        },
    ],
});
