'use strict';

var bind = Function.prototype.bind;

var hasOwn = bind.call(Function.call, Object.prototype.hasOwnProperty);

export { hasOwn };
