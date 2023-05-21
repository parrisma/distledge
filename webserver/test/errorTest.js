require('module-alias/register'); // npm i --save module-alias
const { ERR_FAILED_PERSIST, ERR_PERSIST_INIT, ERR_PURGE, ERR_FAILED_LIST } = require("@webserver/serverErrorCodes.js");
const { getFullyQualifiedError, deepCopyJson } = require("@webserver/serverErrors");

async function main() {
    try {
        try {
            try {
                try {
                    try {
                        x = missingFunc(); // Forced error.
                    } catch (err1) {
                        console.log(`======= 1 ======== `);
                        let erj1 = getFullyQualifiedError(
                            ERR_FAILED_PERSIST,
                            `Fail Level 1`,
                            err1);
                        console.log(`ERR-1: [${JSON.stringify(erj1, null, 2)}]`);
                        throw erj1;
                    }
                } catch (err2) {
                    console.log(`======= 2 ========`);
                    let erj2 = getFullyQualifiedError(
                        ERR_FAILED_PERSIST,
                        `Fail Level 2`,
                        err2);
                    //console.log(`ERR-2.0: [${JSON.stringify(err2, null, 2)}]`);
                    console.log(`ERR-2: [${JSON.stringify(erj2, null, 2)}]`);
                    //console.log(`ERR-2.1: [${JSON.stringify(err2, null, 2)}]`);
                    throw erj2;
                }
            } catch (err3) {
                console.log(`======= 3 ========`);
                let erj3 = getFullyQualifiedError(
                    ERR_FAILED_PERSIST,
                    `Fail Level 3`,
                    err3);
                console.log(`ERR-3: [${JSON.stringify(erj3, null, 2)}]`);
                throw erj3;
            }
        } catch (err4) {
            console.log(`======= 4 ========`);
            let erj4 = getFullyQualifiedError(
                ERR_FAILED_PERSIST,
                `Fail Level 4`,
                err4);
            console.log(`ERR-4: [${JSON.stringify(erj4, null, 2)}]`);
            throw erj4;

        }
    } catch (errF) {
        console.log(`======= Final ========`);
        console.log(`ERR-3: [${JSON.stringify(errF, null, 2)}]`);
    }
}

/**
 * The main processing loop
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});