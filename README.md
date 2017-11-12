Thens 🕺🏻 🕺🏻 🕺🏻
==

The instrument to create async functions sequence with single argument, powered by Promise.

With *thens* you do not need to know is asynchronious your function(s) or not, the result always will be async. And you do not need to declare `Promise.resolve`, or `new Promise`, or `async` to start sequence. Call it as simple async function and await result. Or use as handler for another `then`.

```js
import thens from 'thens';

const calc = thens(
  a => a + 1,
  b => Promise.resolve(b + 1),
  c => new Promise((resolve) => setTimeout(() => resolve(c + 1))),
  [
    d => d + 1,
    d => Promise.resolve(e + 2),
    d => new Promise((resolve) => setTimeout(() => resolve(f + 3))),
  ]
);

calc(0).then(console.log); // [4, 5, 6]
```

Is equals to:

```js
const calc = function(props) {
  return Promise.resolve(props)
  .then(a => a + 1)
  .then(b => Promise.resolve(b + 1))
  .then(c => new Promise(
    (resolve) => setTimeout(() => resolve(c + 1))
  ))
  .then((props) => Promise.all([
    Promise.resolve(props).then(d => d + 1),
    Promise.resolve(props).then(d => Promise.resolve(e + 2)),
    Promise.resolve(props).then(d => new Promise(
      (resolve) => setTimeout(() => resolve(f + 3))
    )),
  ]))
};

calc(0).then(console.log); // [4, 5, 6]
```

## License

MIT, 2017, Vladimir Klamykov <vladimirmorulus@gmail.com>