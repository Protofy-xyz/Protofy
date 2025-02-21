// jest-globals.d.ts
declare global {
    function describeLongTest(name: string, fn: () => void): void;
    namespace describeLongTest {
      var skip: (name: string, fn: () => void) => void;
    }
  }
  
  export {};