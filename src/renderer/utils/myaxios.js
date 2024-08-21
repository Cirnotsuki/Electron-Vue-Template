import QS from '../modules/qs';
import axios from '../modules/axios';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
axios.defaults.timeout = 180000;
axios.defaults.maxContentLength = 2147483647;
axios.defaults.responseType = 'json';
axios.defaults.responseEncoding = 'utf8';
axios.defaults.transformRequest = [function (data) {
    return QS.stringify(data);
}];

axios.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error),
);

// 自定义axios实例
const myInstance = axios.create();
// 自定义实例发送数据前组装
myInstance.defaults.transformRequest = [function (data, headers) {
    // 已经全局设置axios的默认Content-Type，需要特别指定时通过options加上即可（主要针对文件上传）
    // 参数统一使用json格式
    if (headers['Content-Type']) {
        return data;
    }
    if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
            data[key] = JSON.stringify(value);
        }
    }
    return QS.stringify(data);
}];

myInstance.defaults.withCredentials = true;

myInstance.interceptors.response.use(res => res.data, err => {
    if (err.response) {
        return Promise.reject(err.response.data.msg);
    }
    return Promise.reject(err.message);
});

const myAxios = {
    install(Vue) {
        // 默认axios请求使用统表辅助系统后端，跨域请求不要更改（服务器不是我控制，调整麻烦）
        Vue.prototype.$http = axios;
        // 自定义axios请求使用企业版后端
        Vue.prototype.$axios = (method, url, data, config) => myAxios.axios(method, url, data, config);
        Vue.prototype.$get = (url, data, config) => myAxios.get(url, data, config);
        Vue.prototype.$post = (url, data, config) => myAxios.post(url, data, config);
    },
    get(url, data = {}, config = {}) {
        return myInstance.get(url, Object.assign(config, { params: data }));
    },
    post(url, data = {}, config = {}) {
        return myInstance.post(url, data, config);
    },
    axios(method, url, data, config = {}) {
        if (method.toLowerCase() === 'get') {
            return myAxios.get(url, data, config);
        }
        return myAxios.post(url, data, config);
    },
};

export default myAxios;
