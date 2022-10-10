/**
 * A utility class for logging purposes
 */
class Logger {
    constructor(context) {
        this.context = context;
        this.RESET = "\x1b[0m";
        this.COLOR_RED = "\x1b[31m";
        this.COLOR_GREEN = "\x1b[32m";
        this.COLOR_WHITE = "\x1b[37m";
        this.COLOR_YELLOW = "\x1b[33m";
    }

    error(message) {
        console.log(`${this.COLOR_RED}[ERROR in ${this.context}]: ${message}${this.RESET}`);
    }

    success(message) {
        console.log(`${this.COLOR_GREEN}[SUCCESS in ${this.context}]: ${message}${this.RESET}`);
    }

    log(message) {
        console.log(`${this.COLOR_WHITE}[LOG in ${this.context}]: ${message}${this.RESET}`);
    }

    warn(message) {
        console.log(`${this.COLOR_YELLOW}[WARN in ${this.context}]: ${message}${this.RESET}`);
    }
}

module.exports.Logger = Logger;