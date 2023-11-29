// Overview:
// 1. Implement `resolve` and `reject`
// 2. The state is immutable
// 3. Deal with throw
// 4. Implement `then`
//    - a) onFulfilled, onRejected
//    - b) timer => execute callbacks later
//    - c) chain call (`then` should return a promise)
//    - d) Execution sequence (use setTimeout)

class MyPromise {
  constructor(executor) {
    // Initiate values
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // Execute
    // - need to use "bind",
    // - when functions are passed as arguments:
    // - new MyPromise((resolve, reject) => {...}),
    // - they are detached from their original context.
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  resolve(value) {
    // The state is immutable after resolved or rejected
    if (this.PromiseState != 'pending') return;
    // Change state and result
    this.PromiseState = 'fulfilled';
    this.PromiseResult = value;
    // Execute saved fulfilled callbacks
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // The state is immutable after resolved or rejected
    if (this.PromiseState != 'pending') return;
    // Change state and result
    this.PromiseState = 'rejected';
    this.PromiseResult = reason;
    // Execute saved rejected callbacks
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    // Check the type
    typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    typeof onRejected === 'function'
      ? onRejected
      : (reason) => {
          throw reason;
        };

    // Should declare first so that `result === thenPromise` can access
    let thenPromise;
    // Return a new promise
    thenPromise = new MyPromise((resolve, reject) => {
      const handlePromiseResolution = function (callback) {
        // setTimeout is macro task
        // so this will keep
        setTimeout(() => {
          // the `callback` here is either onFulfilled or onRejected written by user
          try {
            // console.log(this)
            // the `result` here is either a value or a promise
            const result = callback(this.PromiseResult);
            // `result` can't be itself, otherwise it will cause an infinite loop.
            if (result === thenPromise) {
              throw new Error('Chaining cycle detected for promise');
            }

            // if the `result` is a promise
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              // it is a value
              resolve(result);
            }
          } catch (error) {
            reject(error);
            throw new Error(error);
          }
        });
      };

      // Execute callback functions
      if (this.PromiseState === 'fulfilled') {
        // because there's a "this" in handlePromiseResolution,
        // we need to use bind()
        // or
        // we can define it as an arrow function and then we do not need
        // a bind here, just call handlePromiseResolution(onFulfilled)
        handlePromiseResolution.bind(this, onFulfilled)();
      } else if (this.PromiseState === 'rejected') {
        handlePromiseResolution.bind(this, onRejected)();
      } else if (this.PromiseState === 'pending') {
        // Pending: save callbacks to execute them later
        this.onFulfilledCallbacks.push(
          handlePromiseResolution.bind(this, onFulfilled)
        );
        this.onRejectedCallbacks.push(
          handlePromiseResolution.bind(this, onRejected)
        );
      }
    });

    return thenPromise;
  }
}

// Test
// const test1 = new MyPromise((resolve, reject) => {
//   resolve('success');
// });
// console.log('test1', test1); // MyPromise { PromiseState: 'fulfilled', PromiseResult: 'success' }

// const test2 = new MyPromise((resolve, reject) => {
//   reject('fail');
// });
// console.log('test2', test2); // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }

// const test3 = new MyPromise(() => {
//   throw 'fail';
// });
// console.log('test3', test3); // MyPromise { PromiseState: 'rejected', PromiseResult: 'fail' }

// const test4 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('success'); // 'success' after 1 s
//   }, 1000);
// }).then(
//   (res) => console.log('test4', res),
//   (err) => console.log('test4', err)
// );

const test5 = new MyPromise((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => 2 * res,
    (err) => 3 * err
  )
  .then(
    (res) => console.log('success', res),
    (err) => console.log('fail', err)
  );

const test6 = new MyPromise((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => new MyPromise((resolve, reject) => reject(2 * res)),
    (err) => new Promise((resolve, reject) => resolve(3 * err))
  )
  .then(
    (res) => console.log('success', res),
    (err) => console.log('fail', err)
  );
