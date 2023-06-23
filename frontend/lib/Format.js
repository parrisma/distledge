/**
 * Format a number as string
 * @param {*} number - The Number to format
 * @param {*} num_decimals - The number of decimal places
 * @param {*} include_comma - Include thousands comma
 * @returns 
 */
function formatNumber(number, num_decimals, include_comma) {
    return number.toLocaleString('en-US', { useGrouping: include_comma, minimumFractionDigits: num_decimals, maximumFractionDigits: num_decimals });
}

export {
    formatNumber
};