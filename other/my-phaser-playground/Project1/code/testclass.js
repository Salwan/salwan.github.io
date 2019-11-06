var TestClass = function() {
    this.message = "Please TestClass Now!!";
};
TestClass.prototype.doStuff = function() {
    console.log(this.message);
    console.log("Awesome Stuff");
};