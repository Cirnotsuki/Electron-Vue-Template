'use strict';

import GetIntrinsic from '../get-intrinsic/index';

import callBind from './index';

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

export default function callBound(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};
