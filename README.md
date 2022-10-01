# Compiler in javascript (v1.1.3)
This is a small, toy compiler that I've written in javascript. It's not meant to be used in production, but rather as a learning tool. I've tried to make it as simple as possible, while still being useful. It's not meant to be a full-featured compiler, but rather a small, simple compiler that can be used to learn about compiler design.

What this compiler can do for now:
- Compile a simple program consisting of only main function that returns an integer
- Support for unary operators on the integer type is present
- Support for binary operators on the integer type is present

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

## Important notes
- This project is still in development, so it's not guaranteed to work. If you find any bugs, please open an issue.
- This project is not meant to be used in production, but rather as a learning tool.
- It does not generate the binary executable, it just generates the assembly code. You need to use gcc/g++ to generate the binary executable.
- To test the compiler against a fixed set of test cases, you can use the sample c programs present in input directory. A script test.py can also be used for running the tests
- To run the tests, run ```python3 test.py <Test_numbers>``` from the root directory of the project
- Example: ```python3 test.py 1 2 3``` will run the tests 1, 2 and 3
- Test programs are inspired by [nlsandler](https://github.com/nlsandler)