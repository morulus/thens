import isPromise from 'is-promise';
import functionize from './helpers/functionize';

function reflow(stage1, props) {
  const stage2 = stage1.reduce(function(chain, promise) {
    return chain.then(promise);
  }, Promise.resolve(props));
  return stage2;
}

export default function flow(...units) {
  const stage1 = units
  .map(functionize)
  return function(props = {}) {
    return reflow(stage1, props);
  }
}