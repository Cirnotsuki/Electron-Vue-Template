import fs from 'fs';

const version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
const versArr = version.replace(/^v/, '').split('.');
const hasNative = +versArr[0] > 10 || (+versArr[0] === 10 && +versArr[1] >= 12);

const useNative = !hasNative ? () => false : (opts) => opts.mkdir === fs.mkdir;
const useNativeSync = !hasNative ? () => false : (opts) => opts.mkdirSync === fs.mkdirSync;

export { useNative, useNativeSync };
