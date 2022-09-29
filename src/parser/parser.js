const TokenTypes = require('../constants/tokenTypes');
const { exit } = require('process');
const Token = require('../constants/Token');
/**
 * We will be using Backus-Naur Form for specifying our grammar. 
 * All the non terminals would start with a capital letter,
 * and all the terminals would start with a small letter
 * Program -> Function_Declaration
 * Function_Declaration -> "int" function_name "(" ")" "{" Statement "}"
 * Statement -> "return" Expression ";"
 * Expression -> Term { ("+" | "-") Term }
 * Term -> Factor { ("*" | "/") Factor }
 * Factor -> "(" Expression ")" | UnaryOperator Factor | integer
 * BinaryOperator -> "-" | "+" | "/" | "*"
 * UnaryOperator -> "-" | "~" | "!"
 */

/**
 * Class for a node of the abstract syntax tree.
 */
class Node {
    /**
     * Constructor that returns a Node
     * @param {string} value Value of the node 
     * @param {Node[]} children Children array of the current node
     */
    constructor(type, value, children) {
        this.type = type;
        this.value = value;
        this.children = children;
    }
}

/**
 * This function parses expressions
 * @param {Array} tokens An array of tokens
 * @param {Object} indexObject An object that holds the value of current index, as javascript
 * doesn't support pass by reference for atomic integers
 */
function parseExpression(tokens, indexObject) {
    let token = tokens[indexObject.value];
    if (!token) {
        console.log('Unexpected end of input.');
        exit(1);
    } 
    // if it is a integer literal, return constant node
    else if (token.tokenType == TokenTypes.INTEGER_LITERAL.name) {
        indexObject.value++;
        return new Node(token.tokenType, token.value, []);
    } 
    // check if it is a unary operator
    else if (token.tokenType == TokenTypes.MINUS.name || token.tokenType == TokenTypes.BITWISE_COMPLEMENT.name || token.tokenType == TokenTypes.LOGICAL_NEGATION.name) {
        let operatorNode = new Node(token.tokenType, token.value, []);
        indexObject.value++;
        let innerExpression = parseExpression(tokens, indexObject);
        return new Node(operatorNode.type, operatorNode.value, [innerExpression]);
    } else {
        console.log(`Missing expression. Found ${token.value}`);
        exit(1);
    }
}

/**
 * This function parses statements
 * @param {Array} tokens An array of tokens
 * @param {Object} indexObject An object that holds the value of current index, as javascript
 * doesn't support pass by reference for atomic integers
 */
function parseStatement(tokens, indexObject) {
    let token = tokens[indexObject.value];
    if (!token) {
        console.log('Unexpected end of input. Exiting');
        exit(1);
    } else if (token.tokenType != TokenTypes.RETURN_KEYWORD.name) {
        console.log('Error while parsing statement. Expected return statement');
        exit(1);
    } else {
        // Return keyword was found, hence next we should have an integer
        indexObject.value++;
        token = tokens[indexObject.value];
        if (!token) {
            console.log('Unexpected end of input. Exiting');
            exit(1);
        } else {
            // This would return the expression AND it would increment
            // the current index
            let expression = parseExpression(tokens, indexObject);
            let statement = new Node(TokenTypes.STATEMENT.name, 'return', [expression]);
            // if we don't encounter a semicolon now, it means there is 
            // syntax error
            token = tokens[indexObject.value];
            if (!token) {
                console.log('Unexpected end of input. Exiting');
                exit(1);
            } else if (token.tokenType != TokenTypes.SEMICOLON.name) {
                console.log('Syntax Error, expected a semicolon. Exiting');
                exit(1);
            } else {
                indexObject.value++;
                return statement;
            }
        }
    }
}

/**
 * This function parses functions (LOL)
 * @param {Array} tokens  An array of tokens
 * @param {Object} indexObject An object that holds the value of current index, as javascript
 * doesn't support pass by reference for atomic integers
 */
function parseFunction(tokens, indexObject) {
    let token = tokens[indexObject.value];
    let functionName = '';
    if (!token) {
        // Unexpected end of input
        console.log('Unexpected end of input. Exiting');
        exit(1);
    }
    else if (token.tokenType != TokenTypes.INT_KEYWORD.name) {
        // int return type not found
        console.log('Error while parsing, expected return type int. Exiting');
        exit(1);
    } else {
        // int return type found, now proceeding ahead
        indexObject.value++;
        token = tokens[indexObject.value];
        if (!token) {
            // Unexpected end of input
            console.log('Unexpected end of input. Exiting');
            exit(1);
        } else if (token.tokenType != TokenTypes.IDENTIFIER.name) {
            // Identifier not found
            console.log('Error while parsing, expected a function name. Exiting');
            exit(1);
        } else {
            // Identifier found, proceeding ahead
            functionName = token.value;
            indexObject.value++;
            token = tokens[indexObject.value];
            if (!token) {
                // Unexpected end of input
                console.log('Unexpected end of input. Exiting');
                exit(1);
            } else if (token.tokenType != TokenTypes.OPEN_PARENTHESES.name) {
                // Open parentheses not found
                console.log('Error while parsing, expected an opening parentheses (. Exiting');
                exit(1);
            } else {
                // Opening parentheses found, proceeding ahead
                indexObject.value++;
                token = tokens[indexObject.value];
                if (!token) {
                    // Unexpected end of input
                    console.log('Unexpected end of input. Exiting');
                    exit(1);
                } else if (token.tokenType != TokenTypes.CLOSE_PARENTHESES.name) {
                    // Closing parentheses not found
                    console.log('Error while parsing, expected an closing parentheses ). Exiting');
                    exit(1);
                } else {
                    // Closing parentheses found, proceeding ahead
                    indexObject.value++;
                    token = tokens[indexObject.value];
                    if (!token) {
                        // Unexpected end of input
                        console.log('Unexpected end of input. Exiting');
                        exit(1);
                    } else if (token.tokenType != TokenTypes.OPEN_CURLY_BRACE.name) {
                        // Opening curly brace not found
                        console.log('Error while parsing, expected an opening curly brace {. Exiting');
                        exit(1);
                    } else {
                        // Opening curly brace found, proceeding ahead
                        indexObject.value++;
                        let statement = parseStatement(tokens, indexObject);
                        // parseStatement would increment the current index, so reading ahead
                        token = tokens[indexObject.value];
                        if (!token) {
                            // Unexpected end of input
                            console.log('Unexpected end of input. Exiting');
                            exit(1);
                        } else if (token.tokenType != TokenTypes.CLOSE_CURLY_BRACE.name) {
                            // Closing curly brace not found
                            console.log('Error while parsing, expected an closing curly brace }. Exiting');
                            exit(1);
                        } else {
                            let functionDeclaration = new Node(TokenTypes.FUNCTION_DECLARATION.name, functionName, [statement]);
                            return functionDeclaration;
                        }
                    }
                }
            }
        }
    }
}

function parseProgram(tokens, indexObject) {
    if (!tokens || !tokens.length) {
        console.log('Unexpected end of input. Exiting');
        exit(1);
    } else {
        let functionDeclaration = parseFunction(tokens, indexObject);
        let program = new Node(TokenTypes.PROGRAM.name, 'root', [functionDeclaration]);
        return program;
    }
}

module.exports.parseProgram = parseProgram;