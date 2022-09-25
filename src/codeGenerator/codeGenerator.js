const TokenTypes = require('../constants/tokenTypes');
const fs = require('fs');
/**
 * This helper function traverses the tree in recursive fashion for postorder traversal
 * @param {Object} tree 
 * @param {Array} postOrderTraversalArray 
 */
function recursiveHelper(tree, postOrderTraversalArray) {
    tree.children.forEach(child => {
        recursiveHelper(child, postOrderTraversalArray);
    });

    if (tree.type == TokenTypes.INTEGER_LITERAL) {
        tree.assembly = `$${tree.value}`;
    } else if (tree.type == TokenTypes.STATEMENT) {
        if (tree.value == 'return') {
            tree.assembly = `movl   ${tree.children[0].assembly}, %eax\n`;
            tree.assembly += `  ret`; 
        }
    } else if (tree.type == TokenTypes.FUNCTION_DECLARATION) {
        tree.assembly = `   .globl ${tree.value}\n`;
        tree.assembly += `${tree.value}:\n`;
        tree.assembly += `  ${tree.children[0].assembly}\n`;
    }
}


/**
 * This function generates the code from the AST generated after parsing the lexical tokens
 * @param {Object} abstractSyntaxTree The abstract syntax tree which is generated after
 * parsing the tokens
 */
function codeGenerator(abstractSyntaxTree) {
    let postOrderTraversal = [];
    recursiveHelper(abstractSyntaxTree, postOrderTraversal);
    const folderName = 'output';
    const fileName = 'out.s';
    try {
        if (!fs.existsSync(`../${folderName}`)) {
            fs.mkdirSync(`../${folderName}`);
        }
        fs.writeFileSync(`../${folderName}/${fileName}`, abstractSyntaxTree.children[0].assembly);
        console.log(`Output assemby code generated in ../${folderName}/${fileName}, please compile with gcc to make it executable :)`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = codeGenerator;