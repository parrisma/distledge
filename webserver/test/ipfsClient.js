const { addTextToIPFS, getTextFromIPFS, up, uploadImageToIPFS } = require("../ipfs/ipfsClient.js");

async function main() {
    const cid = await addTextToIPFS("Hello Digital Gargage team!");
    console.log(cid);
    const text = await getTextFromIPFS(cid);
    console.log(text);
    const cid2 = await uploadImageToIPFS("../icon/favicon.png");
    console.log(cid2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
