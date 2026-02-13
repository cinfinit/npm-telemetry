// index.js
console.log("Hello world");

// Dynamic code execution
eval('console.log("eval is running")');

const fn = new Function('console.log("new Function is running")');
fn();
