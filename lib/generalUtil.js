/**
 * Blocking sleep
 * @param {*} ms the number of milliseconds to sleep for
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
function pad2(v) {
    sv = `${v}`;
    if (1 == sv.length) {
        sv = `0${sv}`;
    }
    return sv;
}

/**
 * Get current date and time.
 * @returns current date & time as string
 */
function currentDateTime() {
    const d = new Date();
    return `${pad2(d.getDay())}-${months[d.getMonth()]}-${d.getFullYear()}:${pad2(d.getHours())}-${pad2(d.getMinutes())}-${pad2(d.getSeconds())}-${d.getMilliseconds()}::${pad2(d.getTimezoneOffset() / 60)}`;
}

/* True if [value] is a positive integer
*/
function isNumeric(value) {
    return /^\d+$/.test(value);
}

/**
 * Get current date and time.
 * @returns current date & time as string
 */
function currentDateTime() {
    const d = new Date();
    return `${pad2(d.getDay())}-${months[d.getMonth()]}-${d.getFullYear()}:${pad2(d.getHours())}-${pad2(d.getMinutes())}-${pad2(d.getSeconds())}-${d.getMilliseconds()}::${pad2(d.getTimezoneOffset() / 60)}`;
}

module.exports = {
    sleep,
    currentDateTime,
    isNumeric,
    currentDateTime
}
