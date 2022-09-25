const fs = require('fs');
const { exit } = require('process');
const tokenizer = require('./tokenizer/tokenizer');
const { parseProgram } = require('./parser/parser');
const codeGenerator = require('./codeGenerator/codeGenerator');

// Process command line arguments here
// Expect first argument to be path of file to be read
if (!process.argv[2]) {
    console.log("Please enter a valid file path. Exiting now");
    exit();
}

const inputFile = process.argv[2];

try {
    // Read the input file synchronously
    const data = fs.readFileSync(inputFile, 'utf-8');
    // get all the tokens in the source code
    let tokens = tokenizer(data);
    // now it's time to generate AST for the program
    let indexObject = {
        value : 0
    }
    let abstractSyntaxTree = parseProgram(tokens, indexObject);
    // generating the code
    codeGenerator(abstractSyntaxTree);
} catch (err) {
    console.log(err);
}
