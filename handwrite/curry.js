function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      // stop condition
      return func.apply(this, args);
      // if you don't care about who call this curry function:
      // return func(...args);
      // but use apply is the best practice
    }

    return function (...args2) {
      return curried.apply(this, args.concat(args2));
      // return curried(...args, ...args2);
    };
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
