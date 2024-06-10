//              DECORATORS - Meta Programming

// in tsconfig.json the "target" need to be set to "es6" or higher
// and "experimentalDecorators": true /* Enables experimental support for ES7 decorators. */

// Decorator is a function that can be used to add metadata to a class, method, accessor, property or parameter
// Decorators are just functions and they are executed when the class is defined not when the class is instantiated
// Decorators are applied using the @ symbol followed by the decorator name
// Decorators are executed when the class is defined not when the class is instantiated
// Decorators are executed bottom up (so bottom first)

// Decorator Factory - advantages: you can pass arguments to the decorator and use them inside the decorator
function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log("TEMPLATE FACTORY");
  return function <T extends { new (...args: any[]): { name: string } }>(
    constructor: T
  ) {
    // this decorator returns a new class, so we can extend the original class
    // and add some extra functionality, like in this case, we are rendering the template
    // in this case the DOM element will be rendered only when the class is instantiated and
    // not when the class is defined
    return class extends constructor {
      constructor(..._: any[]) {
        super();
        console.log("Rendering template");
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

@Logger("LOGGING - PERSON")
@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
  name = "Andrea";

  constructor() {
    console.log("Creating a new person");
  }
}

const pers = new Person();
console.log(pers);

// ---

// Property Decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator!");
  console.log(target, propertyName);
}

// Accessor Decorator
// is used for getters and setters, not for properties.
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Method Decorator
// is used for methods.
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Parameter Decorator
// is used for parameters.
function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Parameter decorator!");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid price - should be positive");
    }
  }
  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const prod1 = new Product("Book", 19);
const prod2 = new Product("Book 2", 29);

// ---
// Autobind Decorator

function Autobind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // this will be the object where the method is called
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = "This works!";
  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const printer = new Printer();
const button = document.querySelector("button")!;

button.addEventListener("click", printer.showMessage);
