/* This is a GUID like unquiue ID.
**
** In a real sitatuion we would use a compliant UUID generator. 
** See: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
*/
export function GloballyUniqueId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}