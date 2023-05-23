const fs = require('fs');

async function addTextToIPFS(data) {
  const { create } = await import('ipfs-core')
  const ipfs = await create()
  const result = await ipfs.add(data);
  const ipfsHash = result.cid.toString();
  console.log('IPFS Hash:', ipfsHash);
  return ipfsHash;
}

async function getTextFromIPFS(ipfsHash) {
  const { create } = await import('ipfs-core')
  const ipfs = await create()
  let text = ''
  const decoder = new TextDecoder()
  for await (const chunk of ipfs.cat(ipfsHash)) {
    text += decoder.decode(chunk, {
      stream: true
    })
  }
  console.log("Retrieved file contents:", text);
  return text;
}

async function uploadImageToIPFS(imagePath) {
  const { create } = await import('ipfs-core')
  const ipfs = await create()

  // Read the image file as a buffer
  const imageBuffer = fs.readFileSync(imagePath);

  // Upload the image to IPFS
  const result = await ipfs.add(imageBuffer);
  const ipfsHash = result.cid.toString();

  console.log('IPFS Hash:', ipfsHash);
  return ipfsHash;
}

module.exports = {
  addTextToIPFS,
  getTextFromIPFS,
  uploadImageToIPFS
};