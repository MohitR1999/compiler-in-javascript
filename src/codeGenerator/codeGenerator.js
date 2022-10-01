const TokenTypes = require('../constants/tokenTypes');
const fs = require('fs');
const { exec } = require('child_process');

/**
 * This function generates the assembly code for a particular node of AST
 * @param {Object} treeNode The node of AST
 */
function generateAssemblyForTreeNode(treeNode) {
    if (treeNode.type == TokenTypes.INTEGER_LITERAL.name) {
        let assemblyString = `\tmov    $${treeNode.value}, %rax\n`;
        treeNode.assembly = assemblyString;
    } else if (treeNode.type == TokenTypes.STATEMENT.name) {
        if (treeNode.value == 'return') {
            let assemblyString = treeNode.children[0].assembly + `\tret\n`;
            treeNode.assembly = assemblyString;
        }
    } else if (treeNode.type == TokenTypes.FUNCTION_DECLARATION.name) {
        let assemblyString = `${treeNode.value}:\n` + treeNode.children[0].assembly;
        treeNode.assembly = assemblyString;
    } 
    // Code generation for Negation operator
    else if (treeNode.type == TokenTypes.MINUS.name && treeNode.children.length == 1) {
        let assemblyString = treeNode.children[0].assembly + `\tneg     %rax\n`;
        treeNode.assembly = assemblyString;
    } 
    // Code generation for Bitwise complement operator
    else if (treeNode.type == TokenTypes.BITWISE_COMPLEMENT.name) {
        let assemblyString = treeNode.children[0].assembly + `\tnot     %rax\n`;
        treeNode.assembly = assemblyString;
    }
    // Code generation for logical negation operator
    else if (treeNode.type == TokenTypes.LOGICAL_NEGATION.name) {
        let assemblyString = treeNode.children[0].assembly;
        assemblyString += `\tcmp    $0, %rax\n`;
        assemblyString += `\tmov    $0, %rax\n`;
        assemblyString += `\tsete    %al\n`;
        treeNode.assembly = assemblyString;
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
    }
    
    else {
        let assemblyString = `\t.globl ${treeNode.children[0].value}\n` + treeNode.children[0].assembly;
        treeNode.assembly = assemblyString;
    }
}

/**
 * This helper function traverses the tree in recursive fashion for postorder traversal
 * @param {Object} tree 
 * @param {Array} postOrderTraversalArray 
 */
function recursiveHelper(tree, postOrderTraversalArray) {
    tree.children.forEach(child => {
        recursiveHelper(child, postOrderTraversalArray);
    });

    generateAssemblyForTreeNode(tree);
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

module.exports = codeGenerator;