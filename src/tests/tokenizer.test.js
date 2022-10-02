const Token = require('../constants/Token');
const TokenTypes = require('../constants/tokenTypes');
const tokenizer = require('../tokenizer/tokenizer');
const fs = require('fs');

/**
 * A small utility class for logging
 */
class Log {
    constructor(context) {
        this.context = context;
        this.RESET = "\x1b[0m";
        this.COLOR_RED = "\x1b[31m";
        this.COLOR_GREEN = "\x1b[32m";
        this.COLOR_WHITE = "\x1b[37m";
    }
    
    error = (message) => {
        console.log(`${this.COLOR_RED}FAIL: ${message}${this.RESET}`);
    }

    success = (message) => {
        console.log(`${this.COLOR_GREEN}SUCCESS: ${message}${this.RESET}`);
    }

    log = (message) => {
        console.log(`${this.COLOR_WHITE}LOG: ${message}${this.RESET}`);
    }
}

// okay so this file intends to test the tokenizer
// since the tokenizer function returns an array of tokens
// we can inspect that manually if it is working or not
// for the initial phase we will just call the function and get
// the array of tokens.
// Then we will compare the generated array of tokens with the json that
// exists in the snapshot folder. If all the array elements match, then 
// test is passed, otherwise fail

// Week 1 files
const week1 = [
    {
        inputFile : "../../input/stage_1/valid/multi_digit.c",
        snapshotFile : "../../snapshots/stage_1/valid/multi_digit.json"
    },
    
    {
        inputFile : "../../input/stage_1/valid/newlines.c",
        snapshotFile : "../../snapshots/stage_1/valid/newlines.json"
    },

    {
        inputFile : "../../input/stage_1/valid/no_newlines.c",
        snapshotFile : "../../snapshots/stage_1/valid/no_newlines.json"
    },

    {
        inputFile : "../../input/stage_1/valid/return_0.c",
        snapshotFile : "../../snapshots/stage_1/valid/return_0.json"
    },

    {
        inputFile : "../../input/stage_1/valid/return_2.c",
        snapshotFile : "../../snapshots/stage_1/valid/return_2.json"
    },

    {
        inputFile : "../../input/stage_1/valid/spaces.c",
        snapshotFile : "../../snapshots/stage_1/valid/spaces.json"
    }
]

let logger = new Log('Week 1');
logger.log(`Starting testcases for ${logger.context}`);
for(let index = 0; index < week1.length; index++) {
    let fileObject = week1[index];
    try {
        const data = fs.readFileSync(fileObject.inputFile, 'utf-8');
        const jsonData = fs.readFileSync(fileObject.snapshotFile, 'utf-8');
        const jsonArray = JSON.parse(jsonData);
        const arrayOfTokens = tokenizer(data);
        let success = true;
        if (jsonArray.length != arrayOfTokens.length) {
            logger.error('Array length not matching to existing snapshot');
            success = false;
        } else {
            for(let i = 0; i < arrayOfTokens.length; i++) {
                let returnedToken = arrayOfTokens[i];
                let existingSnapshotToken = jsonArray[i];
                if (returnedToken.tokenType != existingSnapshotToken.tokenType) {
                    logger.log(`For index ${i} in the generated array of tokens:`);
                    logger.error(`I was expecting ${existingSnapshotToken.tokenType}, but I found ${returnedToken.tokenType}`);
                    success = false;
                    break;
                } else if (returnedToken.value != existingSnapshotToken.value) {
                    logger.log(`For index ${i} in the generated array of tokens:`);
                    logger.error(`I was expecting ${existingSnapshotToken.value}, but I found ${returnedToken.value}`);
                    success = false;
                    break;
                } else {
                    continue;
                }
            }
        }
        if (success) {
            logger.success(`Testcase #${index+1}: passed ✔`);
        } else {
            logger.error(`Testcase #${index+1}: failed ❌`);
        }
    } catch (err) {
        console.log(err);
    }
}
logger.log(`Testcases for ${logger.context} finished`);
