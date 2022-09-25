# Compiler in javascript (v1.0.0)
This is a small, toy compiler that I've written in javascript. It's not meant to be used in production, but rather as a learning tool. I've tried to make it as simple as possible, while still being useful. It's not meant to be a full-featured compiler, but rather a small, simple compiler that can be used to learn about compiler design.

Currently implemented features:
- Lexical analyser: Converts the source code into a list of tokens
- Parser: Converts the list of tokens into an abstract syntax tree
- Code generator: Converts the abstract syntax tree into assembly code

To run this project follow these steps:
- Clone the repository
- Go to the ```src``` folder
- Make sure you have node.js installed
- Run ```node index.js <path_to_your_input_file>``` to compile your code
- That's it!

## Important note
- This project is still in development, so it's not guaranteed to work. If you find any bugs, please open an issue.
- This project is not meant to be used in production, but rather as a learning tool.
- It does not generate the binary executable, it just generates the assembly code. You need to use gcc/g++ to generate the binary executable.