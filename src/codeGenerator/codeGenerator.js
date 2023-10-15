const TokenTypes = require('../constants/tokenTypes');
const fs = require('fs');
const { exec } = require('child_process');

/**
 * A simple label generator utility that returns a unique label
 * everytime it is run
 * @param {String} seed The value of a seeding string 
 * @returns {String} A unique label
 */
function labelGenerator(seed) {
    let random = Math.floor(Math.random() * 10000);
    return `_${seed}${random}`;
}

/**
 * This function generates the code from the AST generated after parsing the lexical tokens
 * @param {Object} abstractSyntaxTree The abstract syntax tree which is generated after
 * parsing the tokens
 */
function codeGenerator(abstractSyntaxTree, fileName) {
    let postOrderTraversal = [];
    recursiveHelper(abstractSyntaxTree, postOrderTraversal);
    const folderName = 'output';
    try {
        if (!fs.existsSync(`../${folderName}`)) {
            fs.mkdirSync(`../${folderName}`);
        }
        fs.writeFileSync(`../${folderName}/${fileName}.s`, abstractSyntaxTree.assembly);
        exec(`gcc ../${folderName}/${fileName}.s -o ../${folderName}/${fileName}.out`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
        });
    } catch (err) {
        console.log(err);
    }
}

class CodeGenerator {
    /**
     * Takes an abstract syntax tree and generates assembly code
     * @param {Object} ast 
     */
    constructor(ast) {
        this.ast = ast;
    }

    /**
    * This function generates the assembly code for a particular node of AST
    * @param {Object} treeNode The node of AST
    */
    generateAssemblyForTreeNode(treeNode) {
        if (treeNode.type == TokenTypes.INTEGER_LITERAL.name) {
            let assemblyString = `\tmov    $${treeNode.value}, %rax\n`;
            treeNode.assembly = assemblyString;
            treeNode.prettyPrintString = `Int<${treeNode.value}>`;
        } else if (treeNode.type == TokenTypes.STATEMENT.name) {
            if (treeNode.value == 'return') {
                let assemblyString = treeNode.children[0].assembly + `\tret\n`;
                treeNode.assembly = assemblyString;
                treeNode.prettyPrintString = `\t\treturn ${treeNode.children[0].prettyPrintString}`;
            }
        } else if (treeNode.type == TokenTypes.FUNCTION_DECLARATION.name) {
            let assemblyString = `${treeNode.value}:\n` + treeNode.children[0].assembly;
            treeNode.assembly = assemblyString;
            treeNode.prettyPrintString = `FUNCTION ${treeNode.value}:\n` + treeNode.children[0].prettyPrintString;
        }
        // Code generation for Negation operator
        else if (treeNode.type == TokenTypes.MINUS.name && treeNode.children.length == 1) {
            let assemblyString = treeNode.children[0].assembly + `\tneg     %rax\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand = treeNode.children[0].prettyPrintString
            let prettyPrintString = `(${operatorValue} ${operand})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // Code generation for Bitwise complement operator
        else if (treeNode.type == TokenTypes.BITWISE_COMPLEMENT.name) {
            let assemblyString = treeNode.children[0].assembly + `\tnot     %rax\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand = treeNode.children[0].prettyPrintString
            let prettyPrintString = `(${operatorValue} ${operand})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // Code generation for logical negation operator
        else if (treeNode.type == TokenTypes.LOGICAL_NEGATION.name) {
            let assemblyString = treeNode.children[0].assembly;
            assemblyString += `\tcmp    $0, %rax\n`;
            assemblyString += `\tmov    $0, %rax\n`;
            assemblyString += `\tsete    %al\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand = treeNode.children[0].prettyPrintString
            let prettyPrintString = `(${operatorValue} ${operand})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // code generation for addition
        else if (treeNode.type == TokenTypes.ADDITION.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tadd   %rcx, %rax\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // code generation for multiplication
        else if (treeNode.type == TokenTypes.MULTIPLICATION.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\timul   %rcx, %rax\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // code generation for subtraction
        else if (treeNode.type == TokenTypes.MINUS.name && treeNode.children.length == 2) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tsub   %rcx, %rax\n`;
            assemblyString += `\tneg   %rax\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // Code generation for division
        else if (treeNode.type == TokenTypes.DIVISION.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            // contents of e1 are now in rcx, contents of e2 are in rax
            // we need to get the contents of e1 in rax, and e2 in ecx
            assemblyString += `\tpush     %rax\n`;
            assemblyString += `\tpush     %rcx\n`;
            assemblyString += `\tpop     %rax\n`;
            assemblyString += `\tpop     %rcx\n`;
            // now rax contains contents of e1, and rcx contains contents of e2
            // sign extend rax to rdx
            assemblyString += `\tcqo\n`;
            // divide and store the quotient in rax
            assemblyString += `\tidiv   %rcx\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // code generation for equal to operator
        else if (treeNode.type == TokenTypes.EQUAL_TO.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tcmp     %rax, %rcx\n`;
            assemblyString += `\tmov     $0, %rax\n`;
            assemblyString += `\tsete     %al\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // code generation for not equal to operator
        else if (treeNode.type == TokenTypes.NOT_EQUAL_TO.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tcmp     %rax, %rcx\n`;
            assemblyString += `\tmov     $0, %rax\n`;
            assemblyString += `\tsetne     %al\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }

        // code generation for less than operator
        else if (treeNode.type == TokenTypes.LESS_THAN.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tcmp     %rax, %rcx\n`;
            assemblyString += `\tmov     $0, %rax\n`;
            assemblyString += `\tsetl     %al\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }

        // code generation for less than or equal operator
        else if (treeNode.type == TokenTypes.LESS_THAN_OR_EQUAL_TO.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tcmp     %rax, %rcx\n`;
            assemblyString += `\tmov     $0, %rax\n`;
            assemblyString += `\tsetle     %al\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }

        // code generation for greater than operator
        else if (treeNode.type == TokenTypes.GREATER_THAN.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tcmp     %rax, %rcx\n`;
            assemblyString += `\tmov     $0, %rax\n`;
            assemblyString += `\tsetg     %al\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }

        // code generation for greater than or equal to operator
        else if (treeNode.type == TokenTypes.GREATER_THAN_OR_EQUAL_TO.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tpush    %rax\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tpop     %rcx\n`;
            assemblyString += `\tcmp     %rax, %rcx\n`;
            assemblyString += `\tmov     $0, %rax\n`;
            assemblyString += `\tsetge     %al\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        // code generation for logical OR operator
        else if (treeNode.type == TokenTypes.LOGICAL_OR.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tcmp    $0, %rax\n`;
            let jumpClause = labelGenerator('clause');
            let endClause = labelGenerator('end');
            assemblyString += `\tje    ${jumpClause}\n`;
            assemblyString += `\tmov    $1, %rax\n`;
            assemblyString += `\tjmp    ${endClause}\n`;
            assemblyString += `${jumpClause}:\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tcmp    $0, %rax\n`;
            assemblyString += `\tmov    $0, %rax\n`;
            assemblyString += `\tsetne  %al\n`;
            assemblyString += `${endClause}:\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }

        // code generation for logical AND operator
        else if (treeNode.type == TokenTypes.LOGICAL_AND.name) {
            let e1AssemblyString = treeNode.children[0].assembly;
            let e2AssemblyString = treeNode.children[1].assembly;
            let assemblyString = '';
            assemblyString += e1AssemblyString;
            assemblyString += `\tcmp    $0, %rax\n`;
            let jumpClause = labelGenerator('clause');
            let endClause = labelGenerator('end');
            assemblyString += `\tjne    ${jumpClause}\n`;
            assemblyString += `\tjmp    ${endClause}\n`;
            assemblyString += `${jumpClause}:\n`;
            assemblyString += e2AssemblyString;
            assemblyString += `\tcmp    $0, %rax\n`;
            assemblyString += `\tmov    $0, %rax\n`;
            assemblyString += `\tsetne  %al\n`;
            assemblyString += `${endClause}:\n`;
            treeNode.assembly = assemblyString;
            let operatorValue = treeNode.value;
            let operand1 = treeNode.children[0].prettyPrintString;
            let operand2 = treeNode.children[1].prettyPrintString;
            let prettyPrintString = `(${operand1} ${operatorValue} ${operand2})`;
            treeNode.prettyPrintString = prettyPrintString;
        }
        else {
            let assemblyString = `\t.globl ${treeNode.children[0].value}\n` + treeNode.children[0].assembly;
            treeNode.assembly = assemblyString;
            let prettyPrintString = `${treeNode.value}:\n\t` + treeNode.children[0].prettyPrintString;
            treeNode.prettyPrintString = prettyPrintString;
        }
    }

    /**
     * This helper method recursively generates the assembly code from the AST 
     * and attaches the assembly to each node
     * @param {Object} node 
     */
    recursiveHelper(node) {
        node.children.forEach(child => {
            this.recursiveHelper(child);
        });
        this.generateAssemblyForTreeNode(node);
    }

    generateAssembly() {
        const node = this.ast;
        this.recursiveHelper(node);
        return node.assembly;
    }
}

module.exports = CodeGenerator;