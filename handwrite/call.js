Function.prototype.myCall = function (context) {
  const ctx = context || window;
  const fnSymbol = Symbol();

  ctx[fnSymbol] = this;

  const args = [...arguments].slice(1);
  const result = ctx[fnSymbol](...args);
  delete ctx[fnSymbol];

  return result;
};

Function.prototype.myApply = function (context, args) {
  const ctx = context || window;
  const fnSymbol = Symbol();

  ctx[fnSymbol] = this;

  const result = ctx[fnSymbol](...args);
  delete ctx[fnSymbol];

  return result;
};

// Test
const foo = {
  value: 1,
};

function myFn(name) {
  console.log("name:", name);
  return this.value;
}

console.log("value:", myFn.myCall(foo, 'travis'));
console.log("value:", myFn.myApply(foo, ['travis']));
