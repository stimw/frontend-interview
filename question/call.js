var value = 'value';

function fn1(x, y) {
  // this: 1, x: 2, y: undefined
  var res = x + y;
  console.log(res, this.value);
}

function fn2(x, y) {
  var res = x - y;
  console.log(res, this.value);
}

fn2.call.call.call.call(fn1, 1, 2); // NaN undefined

// => fn2.call.call.call.call(fn1, 1, 2)
// => (fn2.call.call.call).call(fn1, 1, 2)
// => (Function.prototype.call).call(fn1, 1, 2)
// => fn1.call(1, 2)
// => NaN undefined