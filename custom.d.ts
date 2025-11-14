// globals.d.ts

// declare module '*.css';

// This tells TypeScript that whenever it sees a file ending in .css,
// it should treat it as a module that exports an empty object.
// This satisfies the type checker and removes the error.

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}