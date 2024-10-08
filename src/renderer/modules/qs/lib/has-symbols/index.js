'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
import { hasSymbols } from './shams';

function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbols();
};

export { hasNativeSymbols};
