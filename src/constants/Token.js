/**
 * Class that represents a token
 * Constructor takes two parameters
 * @param {string} tokenType - The fixed type of token. Defined in tokenTypes.js
 * @param {string} value - The literal value of the token that is scanned
 */
class Token {
    constructor(tokenType, value) {
        this.tokenType = tokenType;
        this.value = value;
    }
}

module.exports = Token;