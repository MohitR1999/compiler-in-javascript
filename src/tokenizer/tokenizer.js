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
    const whitespaceRegex = /\s+/;
    const intRegex = /int/;
    const returnRegex = /return/;
    const integerLiteralRegex = /[0-9]+/;
    for (let currentIndex = 0; currentIndex < data.length;) {
        let currentCharacter = data[currentIndex];
        // Checking for one character symbols
        if (currentCharacter == '{') {
            tokens.push(new Token(TokenTypes.OPEN_CURLY_BRACE, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == '}') {
            tokens.push(new Token(TokenTypes.CLOSE_CURLY_BRACE, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == '(') {
            tokens.push(new Token(TokenTypes.OPEN_PARENTHESES, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == ')') {
            tokens.push(new Token(TokenTypes.CLOSE_PARENTHESES, currentCharacter));
            currentIndex++;
        } else if (currentCharacter == ';') {
            tokens.push(new Token(TokenTypes.SEMICOLON, currentCharacter));
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
            if (intRegex.test(word)) {
                tokens.push(new Token(TokenTypes.INT_KEYWORD, word));
            } else if (returnRegex.test(word)) {
                tokens.push(new Token(TokenTypes.RETURN_KEYWORD, word));
            } else if (identiferRegex.test(word)) {
                tokens.push(new Token(TokenTypes.IDENTIFIER, word));
            } else if (integerLiteralRegex.test(word)) {
                tokens.push(new Token(TokenTypes.INTEGER_LITERAL, word));
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