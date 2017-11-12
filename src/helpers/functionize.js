import isPromise from 'is-promise';
import isFunction from './isFunction';
import isError from './isError';
import isArray from './isArray';

export default function functionize(unit) {
  if (isArray(unit)) {
    const async = unit.map(functionize);
    return function multiAsync(props) {
      return Promise.all(
        async.map(function(asyncHandler) {
          return Promise.resolve(props).then(asyncHandler);
        })
      );
    }
  }
  if (isFunction(unit)) {
    return unit;
  }
  if (isPromise(unit)) {
    return function staticPromise(props) {
      return unit;
    };
  }
  return isError(unit) ? () => { throw unit } : () => unit;
}