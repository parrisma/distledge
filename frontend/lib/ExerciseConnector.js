import { NFTServerBaseURI } from "./ERC721Util";

function formatExerciseMessage(optionId, value, buyerAccount, command) {
  var exerciseMessage = {
    command: `${command}`,
    id: optionId,
    buyerAccount: buyerAccount,
    value: value
  };

  return exerciseMessage;
}

export async function sendExerciseRequest(optionId, value, buyerAccount) {
  var optionToPersistAsJson = formatExerciseMessage(optionId, value, buyerAccount, "exercise");
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
