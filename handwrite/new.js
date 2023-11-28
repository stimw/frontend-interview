// 1. Create a new object
// 2. Apply all the properties of Constructor to the new object
// 3. Link the obj.__proto__ to Constructor.prototype
// 4. Check if the Constructor return an object
function objectFactory() {
  const obj = new Object();
  // const Constructor = [...arguments].shift(); ❌
  // Cannot do this above ↑ because it creates a new array so that
  // the original arguments[0] is still Person
  const Constructor = Array.prototype.shift.call(arguments);

  obj.__proto__ = Constructor.prototype;
  const result = Constructor.apply(obj, arguments);

  return typeof result === 'object' ? result : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;

  return {
    name,
    age,
    habit: 'games',
  };
}

Person.prototype.sayYourName = function () {
  console.log(this.name);
};

// Test
const person1 = objectFactory(Person, 'travis', 18);

console.log(person1);
// output: { name: 'travis', age: 18 }
console.log(person1.__proto__);
// { sayYourName: [Function (anonymous)] }
