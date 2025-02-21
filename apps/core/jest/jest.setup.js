global.describeLongTest = (name, fn) => {
    if (process.env.LONG_TESTS === "true") {
        describe(name, fn);
    } 
};

global.describeLongTest.skip = (name, fn) => { 
    describe.skip(name, fn);
};