const fs = require('fs');
const { exit } = require('process');
const tokenizer = require('./tokenizer/tokenizer');
const { Parser } = require('./parser/parser');
const codeGenerator = require('./codeGenerator/codeGenerator');
const path = require('node:path');
const TokenTypes = require('./constants/tokenTypes');
const { Logger } = require('./logger/Logger');

// Process command line arguments here
// Expect first argument to be path of file to be read
if (!process.argv[2]) {
    console.log("Please enter a valid file path. Exiting now");
    exit();
}

const inputFile = process.argv[2];

try {
    const logger = new Logger('index.js');
    // check if the file exists, and if yes then proceed ahead
    if (fs.existsSync(inputFile)) {
        // Read the input file synchronously
        const data = fs.readFileSync(inputFile, 'utf-8');
        // get all the tokens in the source code
        let tokens = tokenizer(data);
        // now it's time to generate AST for the program
        let parser = new Parser(tokens);
        let abstractSyntaxTree = parser.parseProgram();
        // TODO : Pretty Print the abstract syntax tree
        prettyPrint(abstractSyntaxTree);
        logger.log(abstractSyntaxTree.prettyPrintString);
        // generating the code
        const fileName = path.basename(inputFile).split('.')[0];
        codeGenerator(abstractSyntaxTree, fileName);
    } else {
        console.log(`File ${inputFile} does not exist!`);
        exit(1);
    }
} catch (err) {
    console.log(err);
}

function generatePrettyPrintForNode(treeNode) {
    // generating pretty print for Integer
    if (treeNode.type == TokenTypes.INTEGER_LITERAL.name) {
        let prettyPrintString = `Int<${treeNode.value}>`;
        treeNode.prettyPrintString = prettyPrintString;
    } 
    // Generate pretty print for statements
    else if (treeNode.type == TokenTypes.STATEMENT.name) {
        if (treeNode.value == 'return') {
            let prettyPrintString = `\t\treturn ${treeNode.children[0].prettyPrintString}`;
            treeNode.prettyPrintString = prettyPrintString;
        }
    } 
    // generate pretty print for function declarations
    else if (treeNode.type == TokenTypes.FUNCTION_DECLARATION.name) {
        let prettyPrintString = `FUNCTION ${treeNode.value}:\n` + treeNode.children[0].prettyPrintString;
        treeNode.prettyPrintString = prettyPrintString;
    } 
    // generate pretty print for unary operators
    else if (treeNode.children.length == 1
        && (
            treeNode.type == TokenTypes.MINUS.name ||
            treeNode.type == TokenTypes.BITWISE_COMPLEMENT.name ||
            treeNode.type == TokenTypes.LOGICAL_NEGATION.name
        )) {
        let operatorValue = treeNode.value;
        let operatorType = treeNode.type;
        let operand = treeNode.children[0].prettyPrintString
        let prettyPrintString = `${operatorType}<${operatorValue}> ${operand}`;
        treeNode.prettyPrintString = prettyPrintString;
    } 
     
    // code generation for addition
    else if (treeNode.children.length == 2
        && (
            treeNode.type == TokenTypes.ADDITION.name ||
            treeNode.type == TokenTypes.MINUS.name ||
            treeNode.type == TokenTypes.MULTIPLICATION.name ||
            treeNode.type == TokenTypes.DIVISION.name ||
            treeNode.type == TokenTypes.LOGICAL_AND.name ||
            treeNode.type == TokenTypes.LOGICAL_OR.name ||
            treeNode.type == TokenTypes.EQUAL_TO.name ||
            treeNode.type == TokenTypes.NOT_EQUAL_TO.name ||
            treeNode.type == TokenTypes.LESS_THAN.name ||
            treeNode.type == TokenTypes.LESS_THAN_OR_EQUAL_TO.name ||
            treeNode.type == TokenTypes.GREATER_THAN.name ||
            treeNode.type == TokenTypes.GREATER_THAN_OR_EQUAL_TO.name
        )) {
        let operatorValue = treeNode.value;
        let operatorType = treeNode.type;
        let operand1 = treeNode.children[0].prettyPrintString;
        let operand2 = treeNode.children[0].prettyPrintString;
        let prettyPrintString = `${operand1} ${operatorType}<${operatorValue}> ${operand2}`;
        treeNode.prettyPrintString = prettyPrintString;
    }
    
    else {
        let prettyPrintString = `\n${treeNode.value}:\n\t` + treeNode.children[0].prettyPrintString;
        treeNode.prettyPrintString = prettyPrintString;
    }
}

function prettyPrint(treeNode) {
    treeNode.children.forEach(child => {
        prettyPrint(child);
    });
    generatePrettyPrintForNode(treeNode);
}
