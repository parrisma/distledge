const { addTextToIPFS, getTextFromIPFS, up, uploadImageToIPFS, startIpfs } = require("../ipfs/ipfsCore.js");

async function main() {
    await startIpfs();
    const cid = await addTextToIPFS(JSON.stringify({"greeting": "Hello Digital Gargage team!"}));
    console.log(cid);
    const text = await getTextFromIPFS(cid.toString());
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
