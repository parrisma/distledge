let fs = require('fs')

/**
 * Delete all the files in teh given directory that match the given regular expression
 * @param {*} directoryPath 
 * @param {*} regexPattern 
 */
function deleteFilesMatchingPattern(directoryPath, regexPattern) {

    if (fs.existsSync(directoryPath)) {
        let regex = new RegExp(regexPattern, 'i');
        fs.readdirSync(directoryPath)
            .filter(f => regex.test(f))
            .map(f => fs.unlinkSync(directoryPath + f))
    } else {
        throw new Error(`Cannot delete files as [${directoryPath}] does not exist`);
    }
};

module.exports = {
    deleteFilesMatchingPattern,
}

