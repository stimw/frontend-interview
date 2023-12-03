Function.prototype.myBind = function (context, ...args) {
  const self = this;

  const fNOP = function () {};

  const fBound = function (...bindArgs) {
    return self.apply(this instanceof fBound ? this : context, [
      ...args,
      ...bindArgs,
    ]);
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = fNOP.prototype;

  return fBound;
};

// Test
const foo = {
  value: 1,
};

function myFn(name, age) {
  console.log('name:', name);
  console.log('age:', age);
  return this.value;
}

console.log('value:', myFn.myBind(foo, 'travis')(18));
