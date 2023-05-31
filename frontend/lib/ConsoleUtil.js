/* Get a current timestamp for logging messages to console.
*/
export function consoleTimeStamp() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "numeric",
        hour12: false,
    });
}

/* Write a message via the given setter.
*/

export function handleLogChange(logSetter, newLogMessage) {
    try {
        console.log(newLogMessage);
        logSetter(prevLog => `${prevLog}\n${consoleTimeStamp()} - ${newLogMessage}`);
    } catch (err) {
        console.error(`Failed to write console message with error [${err.mesaage}]`);
    }
};