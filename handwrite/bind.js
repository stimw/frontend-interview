Function.prototype.myBind = function (context, ...args) {
  const self = this;

  return function (...bindArgs) {
    return self.apply(context, [...args, ...bindArgs]);
  };
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
