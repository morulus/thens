Thens 🕺🏻 🕺🏻 🕺🏻
==

The instrument to create async functions sequence, powered by Promise. It is Promise.`then` in the plural.

Forget about `Promise.resolve`, or `new Promise`, or `then.then.then` chain. Just compose functions and await result. Or use it as handler for native `then`, or a part of `thens`. And don't forget it **supports [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A)**.

Enjoy.

```shell
yarn add thens
```

Usage.

```js
import thens from 'thens';

const calc = thens(
  // Static
  a => a + 1, 
  // Async like
  b => Promise.resolve(b + 1),
  // Real async
  c => new Promise((resolve) => setTimeout(() => resolve(c + 1))),
  // Like Promise.all
  [
    d => d + 1,
    d => Promise.resolve(d + 2),
    d => new Promise((resolve) => setTimeout(() => resolve(d + 3))),
  ],
  // Generator, driven by rebound runner
  function* ([e, f, g]) {
    // Async inside generator
    const h = yield Promise.resolve(e + f + g);
    try {
      throw new Error('Unexpected error');
    } catch(e) {
      // Error handler inside generator
      return h;
    }
  }
);

calc(0)
.then(console.log) // 15
.catch(console.warn); // And don't forget to add final catch
```

## License

MIT, 2017, Vladimir Kalmykov <vladimirmorulus@gmail.com>