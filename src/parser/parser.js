const TokenTypes = require('../constants/tokenTypes');
const { exit } = require('process');
const Token = require('../constants/Token');
/**
 * We will be using Backus-Naur Form for specifying our grammar. 
 * All the non terminals would start with a capital letter,
 * and all the terminals would start with a small letter
 * Program -> Function_Declaration
 * Function_Declaration -> "int" FunctionName "(" ")" "{" { Statement } "}"
 * Statement -> "return" Expression ";" | Expression ";" | "int" Identifier [ "=" Expression ] ";"
 * Expression -> Identifier "=" Expression | LogicalOrExpression
 * LogicalOrExpression -> LogicalAndExpression { "||" LogicalAndExpression }
 * LogicalAndExpression -> EqualityExpression { "&&" EqualityExpression }
 * EqualityExpression -> RelationalExpression { ( "!=" | "==" ) RelationalExpression }
 * RelationalExpression -> AdditiveExpression { ( "<" | ">" | "<=" | ">=" ) AdditiveExpression }
 * AdditiveExpression -> Term { ("+" | "-") Term }
 * Term -> Factor { ("*" | "/") Factor }
 * Factor -> "(" Expression ")" | UnaryOperator Factor | integer | Identifier
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

class Parser {
    /**
     * Constructor that returns a parser
     * @param {Token[]} tokens the list of tokens
     */
    constructor(tokens) {
        this.tokens = tokens;
        this.currentIndex = 0;
    }
    /**
     * Returns true if the token is a unary operator, false otherwise
     * @param {Object} token 
     */
    isUnaryOperator(token) {
        if (token.tokenType == TokenTypes.MINUS.name || token.tokenType == TokenTypes.LOGICAL_NEGATION.name || token.tokenType == TokenTypes.BITWISE_COMPLEMENT.name) {
            return true;
        }
        return false;
    }

    /**
    * This function parses factors
    */
    parseFactor() {
        let token = this.tokens[this.currentIndex];
        // Check if token exists
        if (!token) {
            console.log('Ahhh! I was expecting more factors here! Exiting now...');
            exit(1);
        }
        // Check if it is opening parentheses
        else if (token.tokenType == TokenTypes.OPEN_PARENTHESES.name) {
            this.currentIndex++;
            // parse expression inside
            let expression = this.parseExpression();
            // check if closing parentheses are there
            token = this.tokens[this.currentIndex];
            this.currentIndex++;
            if (token.tokenType != TokenTypes.CLOSE_PARENTHESES.name) {
                console.log(`I was expecting a closing parentheses. How mean of you to not put that in your code. I'm gonna exit now...`);
                exit(1);
            }
            return expression;
        }
        // check if it is unary operator
        else if (this.isUnaryOperator(token)) {
            this.currentIndex++;
            let factor = this.parseFactor();
            return new Node(token.tokenType, token.value, [factor]);
        }
        // check if it is integer
        else if (token.tokenType == TokenTypes.INTEGER_LITERAL.name) {
            this.currentIndex++;
            return new Node(token.tokenType, token.value, []);
        }
        // check if it is an identifier
        else if (token.tokenType == TokenTypes.IDENTIFIER.name) {
            this.currentIndex++;
            return new Node(token.tokenType, token.value, []);
        }
        else {
            console.log(`Duh! What's this character? I didn't expect this: ${token.value}. Exiting...`);
            exit(1);
        }
    }

    /**
    * This function parses terms
    */
    parseTerm() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log(`Ahh! Can't see any more terms to finish the input! Exiting...`);
            exit(1);
        } else {
            let factor = this.parseFactor();
            token = this.tokens[this.currentIndex];
            while (token.tokenType == TokenTypes.MULTIPLICATION.name || token.tokenType == TokenTypes.DIVISION.name) {
                this.currentIndex++;
                let nextTerm = this.parseFactor();
                factor = new Node(token.tokenType, token.value, [factor, nextTerm]);
                token = this.tokens[this.currentIndex];
            }
            return factor;
        }
    }

    /**
    * This function parses expressions
    */
    parseAdditiveExpression() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log('Ahh! Come on, there are no more expressions here! Exiting...');
            exit(1);
        }
        else {
            let term = this.parseTerm();
            token = this.tokens[this.currentIndex];
            while (token.tokenType == TokenTypes.ADDITION.name || token.tokenType == TokenTypes.MINUS.name) {
                this.currentIndex++;
                let nextTerm = this.parseTerm();
                term = new Node(token.tokenType, token.value, [term, nextTerm]);
                token = this.tokens[this.currentIndex];
            }
            return term;
        }
    }

    /**
    * This function parses a relational expression as specified in the grammar
    */
    parseRelationalExpression() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log(`Huh, I did not see any token. Exiting...`);
        } else {
            let additiveExpression = this.parseAdditiveExpression();
            token = this.tokens[this.currentIndex];
            while (token.tokenType == TokenTypes.LESS_THAN.name
                || token.tokenType == TokenTypes.GREATER_THAN.name
                || token.tokenType == TokenTypes.GREATER_THAN_OR_EQUAL_TO.name
                || token.tokenType == TokenTypes.LESS_THAN_OR_EQUAL_TO.name
            ) {
                this.currentIndex++;
                let nextAdditiveExpression = this.parseAdditiveExpression();
                additiveExpression = new Node(token.tokenType, token.value, [additiveExpression, nextAdditiveExpression]);
                token = this.tokens[this.currentIndex];
            }
            return additiveExpression;
        }
    }

    /**
    * This function parses an equality expression as specified in the grammar
    */
    parseEqualityExpression() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log(`Inside [parseEqualityExpression]: I did not see any token here. Exiting now...`);
            exit(1);
        } else {
            let relationalExpression = this.parseRelationalExpression();
            token = this.tokens[this.currentIndex];
            while (token.tokenType == TokenTypes.EQUAL_TO.name || token.tokenType == TokenTypes.NOT_EQUAL_TO.name) {
                this.currentIndex++;
                let nextRelationalExpression = this.parseRelationalExpression();
                relationalExpression = new Node(token.tokenType, token.value, [relationalExpression, nextRelationalExpression]);
                token = this.tokens[this.currentIndex];
            }
            return relationalExpression;
        }
    }

    /**
    * This function parses a logical AND expression as specified in the grammar
    */
    parseLogicalAndExpression() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log(`Inside [parseLogicalAndExpression]: I did not see any token here. Exiting now...`);
            exit(1);
        } else {
            let equalityExpression = this.parseEqualityExpression();
            token = this.tokens[this.currentIndex];
            while (token.tokenType == TokenTypes.LOGICAL_AND.name) {
                this.currentIndex++;
                let nextEqualityExpression = this.parseEqualityExpression();
                equalityExpression = new Node(token.tokenType, token.value, [equalityExpression, nextEqualityExpression]);
                token = this.tokens[this.currentIndex];
            }
            return equalityExpression;
        }
    }

    /**
    * This function parses a logical OR expression as specified in the grammar
    */
    parseLogicalOrExpression() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log(`Inside [parseLogicalOrExpression]: I did not see any token here. Exiting now...`);
            exit(1);
        } else {
            let logicalAndExpression = this.parseLogicalAndExpression();
            token = this.tokens[this.currentIndex];
            while (token.tokenType == TokenTypes.LOGICAL_OR.name) {
                this.currentIndex++;
                let nextLogicalAndExpression = this.parseLogicalAndExpression();
                logicalAndExpression = new Node(token.tokenType, token.value, [logicalAndExpression, nextLogicalAndExpression]);
                token = this.tokens[this.currentIndex];
            }
            return logicalAndExpression;
        }
    }

    parseExpression() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log(`Inside [parseExpression]: I did not see any token here. Exiting now...`);
            exit(1);
        } else if (token.tokenType == TokenTypes.IDENTIFIER.name) {
            let identifer = new Node(token.tokenType, token.value, []);
            this.currentIndex++;
            token = this.tokens[this.currentIndex];
            this.currentIndex++;
            let expression = this.parseExpression();
            let identifierNode = new Node(token.tokenType, token.value, [identifer, expression]);
            return identifierNode;
        } else {
            return this.parseLogicalOrExpression();
        }
    }

    /**
     * This function parses statements
     */
    parseStatement() {
        let token = this.tokens[this.currentIndex];
        if (!token) {
            console.log('Ahh there is no statement! Exiting now...');
            exit(1);
        } else if (token.tokenType == TokenTypes.RETURN_KEYWORD.name) {
            // Return keyword was found, hence next we should have an integer
            this.currentIndex++;
            token = this.tokens[this.currentIndex];
            if (!token) {
                console.log('Nothing... I saw nothing to return! Exiting now...');
                exit(1);
            } else {
                // This would return the expression AND it would increment
                // the current index
                let expression = this.parseLogicalOrExpression();
                let statement = new Node(TokenTypes.STATEMENT.name, 'return', [expression]);
                // if we don't encounter a semicolon now, it means there is 
                // syntax error
                token = this.tokens[this.currentIndex];
                if (!token) {
                    console.log('Unexpected end of input. Exiting');
                    exit(1);
                } else if (token.tokenType != TokenTypes.SEMICOLON.name) {
                    console.log('Do I need to remind you to put semicolon at the end of the return statement, huh? Exiting now...');
                    exit(1);
                } else {
                    this.currentIndex++;
                    return statement;
                }
            }
        } else if (token.tokenType == TokenTypes.INT_KEYWORD.name) {
            this.currentIndex++;
            token = this.tokens[this.currentIndex];
            if (token.tokenType != TokenTypes.IDENTIFIER.name) {
                console.log(`Inside [parseStatement]: I was expecting a variable name, but didn't get that. Exiting...`);
                exit(1);
            } else {
                let identifer = new Node(token.tokenType, token.value, []);
                this.currentIndex++;
                token = this.tokens[this.currentIndex];
                if (token.tokenType == TokenTypes.SEMICOLON.name) {
                    this.currentIndex++;
                    return new Node(TokenTypes.STATEMENT.name, 'declaration', [identifer]);
                } else if (token.tokenType == TokenTypes.ASSIGNMENT.name) {
                    this.currentIndex++;
                    let expression = this.parseExpression();
                    token = this.tokens[this.currentIndex];
                    if (token.tokenType != TokenTypes.SEMICOLON.name) {
                        console.log('Inside [parseStatement]: I was expecting a semicolon, but did not find any. Exiting...');
                        exit(1);
                    }
                    this.currentIndex++;
                    return new Node(TokenTypes.STATEMENT.name, 'assignment', [identifer, expression]);
                }
            }
        } else {
            let expression = this.parseExpression();
            token = this.tokens[this.currentIndex];
            if (token.tokenType != TokenTypes.SEMICOLON.name) {
                console.log('Inside [parseStatement]: I was expecting a semicolon, but did not find any. Exiting...');
                exit(1);
            }
            this.currentIndex++;
            return new Node(TokenTypes.STATEMENT.name, 'expression', [expression]);
        }
    }

    /**
     * This function parses functions (LOL)
     */
    parseFunction() {
        let token = this.tokens[this.currentIndex];
        let functionName = '';
        if (!token) {
            // Unexpected end of input
            console.log('Nothing to see here! Exiting now from parseFunction...');
            exit(1);
        }
        else if (token.tokenType != TokenTypes.INT_KEYWORD.name) {
            // int return type not found
            console.log('Specify return type as int, you noob! Exiting now...');
            exit(1);
        } else {
            // int return type found, now proceeding ahead
            this.currentIndex++;
            token = this.tokens[this.currentIndex];
            if (!token) {
                // Unexpected end of input
                console.log('Another incomplete input! Go finish writing your program first! Exiting now...');
                exit(1);
            } else if (token.tokenType != TokenTypes.IDENTIFIER.name) {
                // Identifier not found
                console.log('Write a name for your function noob! Exiting...');
                exit(1);
            } else {
                // Identifier found, proceeding ahead
                functionName = token.value;
                this.currentIndex++;
                token = this.tokens[this.currentIndex];
                if (!token) {
                    // Unexpected end of input
                    console.log('Oh come on! Write something more! Exiting now...');
                    exit(1);
                } else if (token.tokenType != TokenTypes.OPEN_PARENTHESES.name) {
                    // Open parentheses not found
                    console.log('I was expecting an opening parentheses that looks like this: ). Exiting...');
                    exit(1);
                } else {
                    // Opening parentheses found, proceeding ahead
                    this.currentIndex++;
                    token = this.tokens[this.currentIndex];
                    if (!token) {
                        // Unexpected end of input
                        console.log('Again! Unexpected end of input! Exiting now...');
                        exit(1);
                    } else if (token.tokenType != TokenTypes.CLOSE_PARENTHESES.name) {
                        // Closing parentheses not found
                        console.log('Do I need to remind you to close your opening parentheses? Noob! Exiting now...');
                        exit(1);
                    } else {
                        // Closing parentheses found, proceeding ahead
                        this.currentIndex++;
                        token = this.tokens[this.currentIndex];
                        if (!token) {
                            // Unexpected end of input
                            console.log('Why do you write incomplete programs? I was not expecting this to end right now. Exiting...');
                            exit(1);
                        } else if (token.tokenType != TokenTypes.OPEN_CURLY_BRACE.name) {
                            // Opening curly brace not found
                            console.log(`I don't see an opening curly brace here {. Exiting...`);
                            exit(1);
                        } else {
                            // Opening curly brace found, proceeding ahead
                            this.currentIndex++;
                            let functionDeclaration = new Node(TokenTypes.FUNCTION_DECLARATION.name, functionName, []);
                            token = this.tokens[this.currentIndex];
                            if (token.tokenType == TokenTypes.CLOSE_CURLY_BRACE.name) {
                                return functionDeclaration;
                            }
                            let statement = this.parseStatement();
                            functionDeclaration.children.push(statement);
                            // parseStatement would increment the current index, so reading ahead
                            token = this.tokens[this.currentIndex];
                            while (token.tokenType != TokenTypes.CLOSE_CURLY_BRACE.name) {
                                if (!token) {
                                    // Unexpected end of input
                                    console.log(`Inside [parseFunction]: Unexpected End of input. Exiting...`);
                                    exit(1);
                                }
                                statement = this.parseStatement();
                                token = this.tokens[this.currentIndex];
                                functionDeclaration.children.push(statement);
                            }

                            if (token.tokenType != TokenTypes.CLOSE_CURLY_BRACE.name) {
                                console.log(`Inside [parseFunction]: Did not get a closing curly brace. Exiting...`);
                                exit(1);
                            }

                            return functionDeclaration;

                        }
                    }
                }
            }
        }
    }

    parseProgram() {
        if (!this.tokens || !this.tokens.length) {
            console.log('Unexpected end of input. Exiting');
            exit(1);
        } else {
            let functionDeclaration = this.parseFunction();
            let program = new Node(TokenTypes.PROGRAM.name, 'root', [functionDeclaration]);
            return program;
        }
    }

}


module.exports.Parser = Parser;