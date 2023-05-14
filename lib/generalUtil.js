/**
 * Blocking sleep
 * @param {*} ms the number of milliseconds to sleep for
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    sleep,
}