import isPromise from 'is-promise';
import isGenerator from 'is-generator';

function resolveThrow(e, generator, resolve, reject) {
  try {
    const caught = generator.throw(e);
    if (caught.done) {
      resolve(caught.value);
    } else {
      resolver(generator.next(caught.value), generator, resolve, reject);
    }
  } catch(e) {
    reject(e);
  }
}

function resolver(next, generator, resolve, reject) {
  const itIsPromise = isPromise(next.value);
  const itIsGenerator = isGenerator(next.value);
  if (itIsPromise || itIsGenerator) {
    (itIsPromise ? next.value : runGenerator(next.value))
    .then(next.done ? resolve : function yieldResultResolver(value) {
      try {
        resolver(generator.next(value), generator, resolve, reject);
      } catch (e) {
        resolveThrow(e, generator, resolve, reject);
      }
    })
    .catch(function(e) {
      resolveThrow(e, generator, resolve, reject);
    });
  } else {
    if (next.done) {
      resolve(next.value);
    } else {
      try {
        resolver(generator.next(next.value), generator, resolve, reject);
      } catch (e) {
        resolveThrow(e, generator, resolve, reject);
      }
    }
  }
}

function runGenerator(generator) {
  return new Promise(function (resolve, reject) {
    try {
      resolver(generator.next(), generator, resolve, reject);
    } catch (e) {
      resolveThrow(e, generator, resolve, reject);
    }
  });
}

module.exports = runGenerator;