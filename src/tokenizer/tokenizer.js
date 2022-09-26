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
    const identiferRegex = /[_a-zA-Z]\w*/;
    const integerLiteralRegex = /[0-9]+/;
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
        // Checking for logical negation operator
        else if (currentCharacter == TokenTypes.LOGICAL_NEGATION.name) {
            tokens.push(new Token(TokenTypes.LOGICAL_NEGATION.value, currentCharacter));
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
        } else {
            currentIndex++;
        }
    }
    return tokens;
}

module.exports = tokenizer;