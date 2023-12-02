function curry(func) {
  // the default parameters is not included
  const funcLen = func.length;
  // collect parameters already processed
  const params = [];

  return function partial(x) {
    params.push(x);
    if (params.length === funcLen) {
      // stop condition
      return func(...params);
    }
    return partial;
  };
}

// Test
function sum(a, b, c) {
  return a + b + c;
}

const currySum = curry(sum);
console.log(currySum(1)(2)(3));
