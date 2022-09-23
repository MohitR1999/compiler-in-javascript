const fs = require('fs');
const { exit } = require('process');
const tokenizer = require('./tokenizer/tokenizer');

// Process command line arguments here
// Expect first argument to be path of file to be read
if (!process.argv[2]) {
    console.log("Please enter a valid file path. Exiting now");
    exit();
}

const inputFile = process.argv[2];

// Read the input file synchronously
try {
    const data = fs.readFileSync(inputFile, 'utf-8');
    let tokens = tokenizer(data);
    console.log(tokens);
} catch (err) {
    console.log(err);
}
