import isPromise from 'is-promise';
import isGenerator from 'is-generator';
import isFunction from './isFunction';
import isError from './isError';
import isArray from './isArray';
import wrapGeneratorFn from './wrapGeneratorFn';

export default function functionize(unit) {
  if (isGenerator.fn(unit)) {
    return wrapGeneratorFn(unit);
  }
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
  throw new TypeError(`Invalid argument of type ${typeof unit} passed to thens. Expects function | array | promise or generator.`);
}