const Token = require('../constants/Token');
const TokenTypes = require('../constants/tokenTypes');
/**
 * This functions returns a list of tokens by scanning
 * through the whole source code
 * @param {string} data - The input source code 
 * @returns {Array} The list of Tokens (Defined in Token.js)
 */
function tokenizer(data) {
    // Regular expressions for usage later
    let tokens = [];
    const alphanumericRegex = /[_a-zA-Z0-9]/;
    for (let currentIndex = 0; currentIndex < data.length;) {
        let currentCharacter = data[currentIndex];
        // Checking for one character symbols
        if (currentCharacter == TokenTypes.OPEN_CURLY_BRACE.value) {
            tokens.push(new Token(TokenTypes.OPEN_CURLY_BRACE.name, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == TokenTypes.CLOSE_CURLY_BRACE.value) {
            tokens.push(new Token(TokenTypes.CLOSE_CURLY_BRACE.name, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == TokenTypes.OPEN_PARENTHESES.value) {
            tokens.push(new Token(TokenTypes.OPEN_PARENTHESES.name, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == TokenTypes.CLOSE_PARENTHESES.value) {
            tokens.push(new Token(TokenTypes.CLOSE_PARENTHESES.name, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == TokenTypes.SEMICOLON.value) {
            tokens.push(new Token(TokenTypes.SEMICOLON.name, currentCharacter));
            currentIndex++;
        }
        // Checking for negation operator
        else if (currentCharacter == TokenTypes.MINUS.value) {
            tokens.push(new Token(TokenTypes.MINUS.name, currentCharacter));
            currentIndex++;
        }
        // Checking for bitwise complement operator
        else if (currentCharacter == TokenTypes.BITWISE_COMPLEMENT.value) {
            tokens.push(new Token(TokenTypes.BITWISE_COMPLEMENT.name, currentCharacter));
            currentIndex++;
        }

        // Check for addition operator
        else if (currentCharacter == TokenTypes.ADDITION.value) {
            tokens.push(new Token(TokenTypes.ADDITION.name, currentCharacter));
            currentIndex++;
        }

        // Checking for multiplication operator
        else if (currentCharacter == TokenTypes.MULTIPLICATION.value) {
            tokens.push(new Token(TokenTypes.MULTIPLICATION.name, currentCharacter));
            currentIndex++;
        }

        // Checking for division operator
        else if (currentCharacter == TokenTypes.DIVISION.value) {
            tokens.push(new Token(TokenTypes.DIVISION.name, currentCharacter));
            currentIndex++;
        }

        // checking for alphanumeric symbols/variables
        else if (alphanumericRegex.test(currentCharacter)) {
            let word = '';
            while (alphanumericRegex.test(data[currentIndex])) {
                word += data[currentIndex];
                currentIndex++;
            }
            // Since after this while loop, the currentIndex has already
            // been advanced further, so there is no need to increment it again
            // as it could cause some characters to be skipped unncessarily
            // Check if the formed word is a reserved keyword or an identifer
            if (word == TokenTypes.INT_KEYWORD.value) {
                tokens.push(new Token(TokenTypes.INT_KEYWORD.name, word));
            } else if (word == TokenTypes.RETURN_KEYWORD.value) {
                tokens.push(new Token(TokenTypes.RETURN_KEYWORD.name, word));
            } else if (TokenTypes.IDENTIFIER.value.test(word)) {
                tokens.push(new Token(TokenTypes.IDENTIFIER.name, word));
            } else if (TokenTypes.INTEGER_LITERAL.value.test(word)) {
                tokens.push(new Token(TokenTypes.INTEGER_LITERAL.name, word));
            } else {
                console.log(`Unknown identifier: ${word}`);
            }
        }
        // Checking for boolean logical operators
        // since these are two charactered operators, we need
        // to check each character one by one
        else if (currentCharacter == '&'
            || currentCharacter == '|'
            || currentCharacter == '='
            || currentCharacter == '!'
            || currentCharacter == '<'
            || currentCharacter == '>'
        ) {
            // cool, so it can be either a single character operator
            // or a two charactered one
            // looking one character ahead to judge whether it is a single character
            // operator or two character operator
            let nextCharacter = data[currentIndex + 1];
            if (
                nextCharacter == '&'
                || nextCharacter == '|'
                || nextCharacter == '='
            ) {
                currentIndex++;
                // We don't have a space following the current character, so it can be
                // a two charactered operator
                let foundToken = currentCharacter + nextCharacter;
                // check if it is a logical AND
                if (foundToken == TokenTypes.LOGICAL_AND.value) {
                    tokens.push(new Token(TokenTypes.LOGICAL_AND.name, foundToken));
                }
                // check if it is a logical OR
                else if (foundToken == TokenTypes.LOGICAL_OR.value) {
                    tokens.push(new Token(TokenTypes.LOGICAL_OR.name, foundToken));
                }
                // check if it is a equal to operator
                else if (foundToken == TokenTypes.EQUAL_TO.value) {
                    tokens.push(new Token(TokenTypes.EQUAL_TO.name, foundToken));
                }
                // check if it is a not equal to operator
                else if (foundToken == TokenTypes.NOT_EQUAL_TO.value) {
                    tokens.push(new Token(TokenTypes.NOT_EQUAL_TO.name, foundToken));
                }
                // check if it is less than or equals to operator
                else if (foundToken == TokenTypes.LESS_THAN_OR_EQUAL_TO.value) {
                    tokens.push(new Token(TokenTypes.LESS_THAN_OR_EQUAL_TO.name, foundToken));
                }
                // check if it is greater than or equal to operator
                else if (foundToken == TokenTypes.GREATER_THAN_OR_EQUAL_TO.value) {
                    tokens.push(new Token(TokenTypes.GREATER_THAN_OR_EQUAL_TO.name, foundToken));
                }
                // otherwise just log an error
                else {
                    console.log(`What's this: '${foundToken}' ? I know nothing like that...`);
                }
            } else {
                // We encountered some other character, so it is a single character operator
                // checking for less than operator
                if (currentCharacter == TokenTypes.LESS_THAN.value) {
                    tokens.push(new Token(TokenTypes.LESS_THAN.name, currentCharacter));
                }
                // check if it is greater than operator
                else if (currentCharacter == TokenTypes.GREATER_THAN.value) {
                    tokens.push(new Token(TokenTypes.GREATER_THAN.name, currentCharacter));
                }
                // Checking for logical negation operator
                else if (currentCharacter == TokenTypes.LOGICAL_NEGATION.value) {
                    tokens.push(new Token(TokenTypes.LOGICAL_NEGATION.name, currentCharacter));
                    currentIndex++;
                }
                // else log as error
                else {
                    console.log(`Huh? What's this: '${currentCharacter}'? I have never seen anything like that...`);
                }
            }
            currentIndex++;
        }

        else {
            currentIndex++;
        }
    }
    // console.log(JSON.stringify(tokens));
    return tokens;
}

module.exports = tokenizer;