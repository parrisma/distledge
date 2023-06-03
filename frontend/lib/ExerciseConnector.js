import { formatOptionTermsMessage } from "./optionTermsUtil";
import { NFTServerBaseURI } from "./ERC721Util";

function formatExerciseMessage(optionId, command) {
  var exerciseMessage = {
    command: `${command}`,
    optionId: optionId,
  };

  return exerciseMessage;
}

export async function sendExerciseRequest(optionId) {
  var optionToPersistAsJson = formatExerciseMessage(optionId, "exercise");
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
