import { NFTServerBaseURI } from "./ERC721Util";

/**
 * Construct the JSON message that is posted to WebServer to request Option Exercise.
 * 
 * @param {*} optionId - The *existing* Option Id to exercise
 * @param {*} value - The current value of the option (?? server knows this so TODO remove)
 * @param {*} currentOwnerAddress - The current owner of the Option NFT
 * @returns JSON response from server
 */
function formatExerciseMessage(optionId, value, currentOwnerAddress) {
  var exerciseMessage = {
    command: `exercise`,
    id: optionId,
    buyerAccount: currentOwnerAddress,
    value: value
  };

  return exerciseMessage;
}

/**
 * Send a request to WebServer to exercise an option
 * 
 * @param {*} optionId - The Option Id to request exercise for
 * @param {*} value - The current value of the option
 * @param {*} currentOwnerAddress - The address of the account that owns the option.
 * @returns 
 */
export async function sendExerciseRequest(optionId, value, currentOwnerAddress) {
  var optionToPersistAsJson = formatExerciseMessage(optionId, value, currentOwnerAddress);
  console.log(optionToPersistAsJson);
  const rawResponse = await fetch(`${NFTServerBaseURI()}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(optionToPersistAsJson),
  });
  return await rawResponse.json();
}
