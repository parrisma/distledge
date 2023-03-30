export function consoleTimeStamp() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "numeric",
        hour12: false,
    });
}

export function handleLogChange(logSetter, currentLogMessages, newLogMessage) {
    logSetter(`${currentLogMessages}\n${consoleTimeStamp()}:${newLogMessage}`);
};