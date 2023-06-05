import { NFTServerBaseURI } from "./ERC721Util";

function formatExerciseMessage(optionId, buyerAccount, command) {
  var exerciseMessage = {
    command: `${command}`,
    id: optionId,
    buyerAccount: buyerAccount
  };

  return exerciseMessage;
}

export async function sendExerciseRequest(optionId, buyerAccount) {
  var optionToPersistAsJson = formatExerciseMessage(optionId, buyerAccount, "exercise");
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
