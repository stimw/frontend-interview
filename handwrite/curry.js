function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      // stop condition
      return func.apply(this, args);
      // if you don't care about who call this curry function:
      // return func(...args);
      // but use apply is the best practice
    }

    return curried.bind(this, ...args);
  };
}

// Test
function sum(a, b, c) {
  return a + b + c;
}

const currySum = curry(sum);
console.log(currySum(1)(2)(3));
console.log(currySum(1, 2)(3));
console.log(currySum(1, 2, 3));
