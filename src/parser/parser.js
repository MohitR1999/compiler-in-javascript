const TokenTypes = require('../constants/tokenTypes');
const { exit } = require('process');
const Token = require('../constants/Token');
/**
 * We will be using Backus-Naur Form for specifying our grammar. 
 * All the non terminals would start with a capital letter,
 * and all the terminals would start with a small letter
 */

/**
 * Class representing an expression, which is defined as follows:
 * Expression -> integer
 */
class Expression {
    constructor(integerValue) {
        this.integerValue = integerValue;
    }
}

/**
 * Class representing a statement, defined as follows:
 * Statement -> return Expression ;
 */
class Statement {
    constructor(expression) {
        this.expression = expression
    }
}

/**
 * Class representing a function declaration, defined as follows:
 * Function_Declaration -> int function_name () { Statement }
 */
class Function_Declaration {
    constructor(functionName, statement) {
        this.functionName = functionName;
        this.statement = statement;
    }
}

/**
 * Class representing a program, defined as follows:
 * Program -> Function_Declaration
 */
class Program {
    constructor(functionDeclaration) {
        this.functionDeclaration = functionDeclaration;
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
        exit();
    } else if (token.tokenType != TokenTypes.INTEGER_LITERAL) {
        console.log('Syntax error, wrong value seen');
        exit();
    } else {
        indexObject.value++;
        return new Expression(token.value);
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
        exit();
    } else if (token.tokenType != TokenTypes.RETURN_KEYWORD) {
        console.log('Error while parsing statement. Expected return statement');
        exit();
    } else {
        // Return keyword was found, hence next we should have an integer
        indexObject.value++;
        token = tokens[indexObject.value];
        if (!token) {
            console.log('Unexpected end of input. Exiting');
            exit();
        } else if (token.tokenType != TokenTypes.INTEGER_LITERAL) {
            console.log('Error while parsing. Expected an integer literal');
            exit();
        } else {
            // This would return the expression AND it would increment
            // the current index
            let expression = parseExpression(tokens, indexObject);
            let statement = new Statement(expression);
            // if we don't encounter a semicolon now, it means there is 
            // syntax error
            token = tokens[indexObject.value];
            if (!token) {
                console.log('Unexpected end of input. Exiting');
                exit();
            } else if (token.tokenType != TokenTypes.SEMICOLON) {
                console.log('Syntax Error, expected a semicolon. Exiting');
                exit();
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
        exit();
    }
    else if (token.tokenType != TokenTypes.INT_KEYWORD) {
        // int return type not found
        console.log('Error while parsing, expected return type int. Exiting');
        exit();
    } else {
        // int return type found, now proceeding ahead
        indexObject.value++;
        token = tokens[indexObject.value];
        if (!token) {
            // Unexpected end of input
            console.log('Unexpected end of input. Exiting');
            exit();
        } else if (token.tokenType != TokenTypes.IDENTIFIER) {
            // Identifier not found
            console.log('Error while parsing, expected a function name. Exiting');
            exit();
        } else {
            // Identifier found, proceeding ahead
            functionName = token.value;
            indexObject.value++;
            token = tokens[indexObject.value];
            if (!token) {
                // Unexpected end of input
                console.log('Unexpected end of input. Exiting');
                exit();
            } else if (token.tokenType != TokenTypes.OPEN_PARENTHESES) {
                // Open parentheses not found
                console.log('Error while parsing, expected an opening parentheses (. Exiting');
                exit();
            } else {
                // Opening parentheses found, proceeding ahead
                indexObject.value++;
                token = tokens[indexObject.value];
                if (!token) {
                    // Unexpected end of input
                    console.log('Unexpected end of input. Exiting');
                    exit();
                } else if (token.tokenType != TokenTypes.CLOSE_PARENTHESES) {
                    // Closing parentheses not found
                    console.log('Error while parsing, expected an closing parentheses ). Exiting');
                    exit();
                } else {
                    // Closing parentheses found, proceeding ahead
                    indexObject.value++;
                    token = tokens[indexObject.value];
                    if (!token) {
                        // Unexpected end of input
                        console.log('Unexpected end of input. Exiting');
                        exit();
                    } else if (token.tokenType != TokenTypes.OPEN_CURLY_BRACE) {
                        // Opening curly brace not found
                        console.log('Error while parsing, expected an opening curly brace {. Exiting');
                        exit();
                    } else {
                        // Opening curly brace found, proceeding ahead
                        indexObject.value++;
                        let statement = parseStatement(tokens, indexObject);
                        // parseStatement would increment the current index, so reading ahead
                        token = tokens[indexObject.value];
                        if (!token) {
                            // Unexpected end of input
                            console.log('Unexpected end of input. Exiting');
                            exit();
                        } else if (token.tokenType != TokenTypes.CLOSE_CURLY_BRACE) {
                            // Closing curly brace not found
                            console.log('Error while parsing, expected an closing curly brace }. Exiting');
                            exit();
                        } else {
                            let functionDeclaration = new Function_Declaration(functionName, statement);
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
        exit();
    } else {
        let functionDeclaration = parseFunction(tokens, indexObject);
        let program = new Program(functionDeclaration);
        return program;
    }
}

module.exports = parseProgram;