const CryptoJS = require('crypto-js');
const crypto = require('crypto');

module.exports = {
    encryptAES(input, ekey, eiv) {
        const key = CryptoJS.enc.Utf8.parse(ekey);
        const iv = CryptoJS.enc.Utf8.parse(eiv);
        const srcs = CryptoJS.enc.Utf8.parse(input);

        const encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return encrypted.ciphertext.toString();
    },

    decryptAES(input, ekey, eiv) {
        const key = CryptoJS.enc.Utf8.parse(ekey);
        const iv = CryptoJS.enc.Utf8.parse(eiv);
        const encryptedHexStr = CryptoJS.enc.Hex.parse(input);
        const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);

        const decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },

    MD5(input) {
        return CryptoJS.MD5(input).toString();
    },

    base64Encode(input) {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input));
    },

    base64Decode(input) {
        return CryptoJS.enc.Base64.parse(input).toString(CryptoJS.enc.Utf8);
    },

    sha256(data) {
        // 创建哈希函数 sha512
        const hash = crypto.createHash('sha256');
        // 输入流编码：utf8、ascii、binary（默认）
        hash.update(data, 'utf8');
        // 输出编码：hex、binary、base64
        return hash.digest('hex');
    },

    md5(data) {
        // 创建哈希函数 sha512
        const hash = crypto.createHash('md5');
        // 输入流编码：utf8、ascii、binary（默认）
        hash.update(data, 'utf8');
        // 输出编码：hex、binary、base64
        return hash.digest('hex');
    },
};
