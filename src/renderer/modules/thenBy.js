module.exports = (function tbe() {
    function id(v) {
        return v;
    }
    function ig(v) {
        return typeof (v) === 'string' ? v.toLowerCase() : v;
    }
    function mc(f, opt) {
        opt = typeof (opt) === 'number' ? { direction: opt } : opt || {};
        if (typeof (f) !== 'function') {
            let prop = f;
            f = function fv1(v1) {
                return v1[prop] ? v1[prop] : '';
            };
        }
        if (f.length === 1) {
            let uf = f;
            let pr = opt.ig ? ig : id;
            let cmp = opt.cmp || function fv2(v1, v2) {
                return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
            };
            f = function fv3(v1, v2) {
                return cmp(pr(uf(v1)), pr(uf(v2)));
            };
        }
        if (opt.direction === -1) {
            return function fv4(v1, v2) {
                return -f(v1, v2);
            };
        }
        return f;
    }
    function tb(func, opt) {
        let x = (typeof (this) === 'function' && !this.firstBy) ? this : false;
        let y = mc(func, opt);
        let f = x ? function tbv(a, b) {
            return x(a, b) || y(a, b);
        }
            : y;
        f.thenBy = tb;
        return f;
    }
    tb.firstBy = tb;
    return tb;
}());
