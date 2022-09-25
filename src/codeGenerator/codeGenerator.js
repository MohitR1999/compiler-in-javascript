const TokenTypes = require('../constants/tokenTypes');
const fs = require('fs');

/**
 * This function generates the assembly code for a particular node of AST
 * @param {Object} treeNode The node of AST
 */
function generateAssemblyForTreeNode(treeNode) {
    if (treeNode.type == TokenTypes.INTEGER_LITERAL) {
        let assemblyString = `\tmovl  $${treeNode.value}, %eax\n`;
        treeNode.assembly = assemblyString;
    } else if (treeNode.type == TokenTypes.STATEMENT) {
        if (treeNode.value == 'return') {
            let assemblyString = treeNode.children[0].assembly + `\tret\n`;
            treeNode.assembly = assemblyString;
        }
    } else if (treeNode.type == TokenTypes.FUNCTION_DECLARATION) {
        let assemblyString = `${treeNode.value}:\n` + treeNode.children[0].assembly;
        treeNode.assembly = assemblyString;
    } else {
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
function codeGenerator(abstractSyntaxTree) {
    let postOrderTraversal = [];
    recursiveHelper(abstractSyntaxTree, postOrderTraversal);
    const folderName = 'output';
    const fileName = 'out.s';
    try {
        if (!fs.existsSync(`../${folderName}`)) {
            fs.mkdirSync(`../${folderName}`);
        }
        fs.writeFileSync(`../${folderName}/${fileName}`, abstractSyntaxTree.assembly);
        console.log(`Output assemby code generated in ../${folderName}/${fileName}, please compile with gcc to make it executable :)`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = codeGenerator;