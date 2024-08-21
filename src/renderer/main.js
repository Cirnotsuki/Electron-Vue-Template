import Vue from './modules/vue/index';
import App from './App.vue';
import router from './router/index';
import store from './store';

// 创建全局变量
Vue.prototype.$global = {};

// 为 Vue 装载网络请求模块
Vue.use(require('@/utils/myaxios').default);

const ComponentList = [

];

ComponentList.forEach((curItem) => {
    curItem.install = () => {
        Vue.component(curItem.name, curItem);
    };

    Vue.use(curItem);
});

Vue.config.productionTip = false;

// 非调试模式将类型错误记录在错误日志中
process.env.NODE_ENV !== 'development' && process.on('uncaughtException', (err) => {
    console.log(`renderer:${err}`);
});

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
}).$mount('#app');
