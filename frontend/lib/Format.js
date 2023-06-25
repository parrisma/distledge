/**
 * Format a number as string
 * @param {*} number - The Number to format
 * @param {*} num_decimals - The number of decimal places
 * @param {*} include_comma - Include thousands comma
 * @returns 
 */
function formatNumber(number, num_decimals, include_comma) {
    var res = '';
    try {
        res = number.toLocaleString('en-US', { useGrouping: include_comma, minimumFractionDigits: num_decimals, maximumFractionDigits: num_decimals });
    } catch (err) {
        res = 'Err';
        console.log(`Failed to format number [${number}] with error [${err.message}]`);
    }
    return res;
}

export {
    formatNumber
};