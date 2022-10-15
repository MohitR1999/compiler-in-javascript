// Import necessary stuff
const path = require('node:path');
const { exit } = require('node:process');
const fs = require('fs/promises');
const tokenizer = require('./tokenizer/tokenizer');
const { Parser } = require('./parser/parser');
const CodeGenerator = require('./codeGenerator/codeGenerator');

// create a class to handle everything
class Compiler {
    /**
     * The constructor will receive the command line arguments from the inovking
     * functions
     * @param {Array} args 
     */
    constructor(args) {
        this.args = args;
        this.flagsAndValues = {};
        this.OUTPUT_FILE_SPECIFIER_FLAG_REGEX = new RegExp('-o|--output');
        this.OUTPUT_FILE = 'OUTPUT_FILE'
        this.HELP_REGEX = new RegExp('-h|--help');
        this.HELP_FLAG = 'HELP_FLAG';
        this.PRETTY_PRINT_FLAG_REGEX = new RegExp('-p|--pretty');
        this.PRETTY_PRINT_FLAG = 'PRETTY_PRINT_FLAG';
        this.INPUT_FILE = 'INPUT_FILE';
        this.helpText = `Usage: node index.js [options] file
Options:
    -h, --help      Print help text
    -p, --pretty    Pretty print the abstract syntax tree for the given program
    -o, --output    Specify the output file to be written to
        `;
    }

    parseArguments() {
        // parse command line arguments
        // there would be two arguments by default
        // 1. the path of nodejs executable
        // 2. the file being executed
        // so we need to start parsing from the third argument onwards
        // the main responsibility of this function is just to parse the arguments
        // error reporting would be done in some other function
        for(let i = 2; i < this.args.length;) {
            let argument = this.args[i];
            // check if there is a help flag
            if (this.HELP_REGEX.test(argument)) {
                this.flagsAndValues[this.HELP_FLAG] = true;
                break;
            }
            
            // check if we need to pretty print the abstract syntax tree
            else if (this.PRETTY_PRINT_FLAG_REGEX.test(argument)) {
                this.flagsAndValues[this.PRETTY_PRINT_FLAG] = true;
                i++;
            }
            
            // check if the output needs to be written to a specific file
            else if (this.OUTPUT_FILE_SPECIFIER_FLAG_REGEX.test(argument)) {
                let outputPath = this.args[++i];
                if (outputPath) {
                    this.flagsAndValues[this.OUTPUT_FILE] = path.resolve(outputPath);
                } else {
                    this.flagsAndValues[this.OUTPUT_FILE] = '';
                }
                i++;
            } 

            // populate the input file
            else {
                let inputFilePath = this.args[i++];
                if (inputFilePath) {
                    this.flagsAndValues[this.INPUT_FILE] = path.resolve(inputFilePath);
                } else {
                    this.flagsAndValues[this.INPUT_FILE] = '';
                }
            }
        }
    }

    run() {
        // do everything inside here
        this.parseArguments();
        if (this.flagsAndValues[this.HELP_FLAG]) {
            console.log(this.helpText);
            exit(0);
        } else {
            const inputFile = this.flagsAndValues[this.INPUT_FILE];
            let outputFile = this.flagsAndValues[this.OUTPUT_FILE];
            const prettyPrint = this.flagsAndValues[this.PRETTY_PRINT_FLAG];
            let assembly = '';
            if (inputFile) {
                fs.access(inputFile, fs.constants.F_OK)
                .then(function() {
                    // file exists, proceed ahead
                    return fs.readFile(inputFile, {encoding : 'utf-8'});
                })
                .then(function (fileContents) {
                    // we have the contents of file available here now
                    // first tokenize the file contents into an array of tokens
                    const tokensArray = tokenizer(fileContents);
                    // form a parser with the array of tokens
                    const parser = new Parser(tokensArray);
                    // get abstract syntax tree
                    const abstractSyntaxTree = parser.parseProgram();
                    const codeGenerator = new CodeGenerator(abstractSyntaxTree);
                    // generate assembly
                    assembly = codeGenerator.generateAssembly();
                    if (prettyPrint) {
                        // get pretty print as well
                        console.log(`Pretty print --------------------------------------------------`);
                        console.log(abstractSyntaxTree.prettyPrintString);
                        console.log(`---------------------------------------------------------------`);
                    }
                    let outputDirectory = '';
                    if (!outputFile) {
                        outputFile = path.resolve('./out.s');
                    }
                    outputDirectory = path.dirname(outputFile);
                    return fs.access(outputDirectory);
                })
                .then(function() {
                    return fs.writeFile(outputFile, assembly);
                })
                .catch(function(err) {
                    console.log(err.message);
                    exit(1);
                });
            } else {
                console.log(`No input file specified. Exiting...`);
                exit(1);
            }
        }
    }
}

// export the class
module.exports = Compiler;