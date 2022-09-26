/**
 * List of all the supported tokens
 */
const OPEN_CURLY_BRACE = {
    name : "OPEN_CURLY_BRACE",
    value : "{"
};

const CLOSE_CURLY_BRACE = {
    name : "CLOSE_CURLY_BRACE",
    value : "}"
};

const OPEN_PARENTHESES = {
    name : "OPEN_PARENTHESES",
    value : "("
};

const CLOSE_PARENTHESES = {
    name : "CLOSE_PARENTHESES",
    value : ")"
};

const SEMICOLON = {
    name : "SEMICOLON",
    value : ";"
};

const INT_KEYWORD = {
    name : "INT_KEYWORD",
    value : "int"
};

const RETURN_KEYWORD = {
    name : "RETURN_KEYWORD",
    value : "return"
};

/**
 * Unary operators
 */
const MINUS = {
    name : "MINUS",
    value : "-"
};

const BITWISE_COMPLEMENT = {
    name : "BITWISE_COMPLEMENT",
    value : "~"
};

const LOGICAL_NEGATION = {
    name : "LOGICAL_NEGATION",
    value : "!"
};

/**
 * Binary operators
 */
const ADDITION = {
    name : "ADDITION",
    value : "+"
};

const MULTIPLICATION = {
    name : "MULTIPLICATION",
    value : "*"
};

const DIVISION = {
    name : "DIVISION",
    value : "/"
};


const IDENTIFIER = {
    name : "IDENTIFIER",
    value : new RegExp('[_a-zA-Z]\w*')
};

const INTEGER_LITERAL = {
    name : "INTEGER_LITERAL",
    value : new RegExp('[0-9]+')
};

const EXPRESSION = {
    name : "EXPRESSION"
};

const STATEMENT = {
    name : "STATEMENT"
};

const FUNCTION_DECLARATION = {
    name : "FUNCTION_DECLARATION"
};

const PROGRAM = {
    name : "PROGRAM"
};

module.exports.OPEN_CURLY_BRACE = OPEN_CURLY_BRACE;
module.exports.CLOSE_CURLY_BRACE = CLOSE_CURLY_BRACE;
module.exports.OPEN_PARENTHESES = OPEN_PARENTHESES;
module.exports.CLOSE_PARENTHESES = CLOSE_PARENTHESES;
module.exports.SEMICOLON = SEMICOLON;
module.exports.INT_KEYWORD = INT_KEYWORD;
module.exports.RETURN_KEYWORD = RETURN_KEYWORD;
module.exports.IDENTIFIER = IDENTIFIER;
module.exports.INTEGER_LITERAL = INTEGER_LITERAL;
module.exports.EXPRESSION = EXPRESSION;
module.exports.STATEMENT = STATEMENT;
module.exports.FUNCTION_DECLARATION = FUNCTION_DECLARATION;
module.exports.PROGRAM = PROGRAM;
module.exports.MINUS = MINUS;
module.exports.BITWISE_COMPLEMENT = BITWISE_COMPLEMENT;
module.exports.LOGICAL_NEGATION = LOGICAL_NEGATION;
module.exports.ADDITION = ADDITION;
module.exports.MULTIPLICATION = MULTIPLICATION;
module.exports.DIVISION = DIVISION;

