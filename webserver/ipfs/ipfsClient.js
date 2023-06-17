const IPFS_URL = process.env.IPFS_URL || "http://localhost:5001";
const fs = require('fs');

async function addTextToIPFS(data) {
  const result = await global.ipfs.add(data);
  const ipfsHash = result.cid.toString();
  console.log('IPFS Hash:', ipfsHash);
  return ipfsHash;
}

async function getTextFromIPFS(ipfsHash) {
  let text = ''
  const decoder = new TextDecoder()
  for await (const chunk of global.ipfs.cat(ipfsHash)) {
    text += decoder.decode(chunk, {
      stream: true
    })
  }
  console.log("Retrieved file contents:", text);
  return JSON.parse(text);
}

async function uploadImageToIPFS(imagePath) {
  const { create } = await import('ipfs-http-client')

  // Read the image file as a buffer
  const imageBuffer = fs.readFileSync(imagePath);

  // Upload the image to IPFS
  const result = await global.ipfs.add(imageBuffer);
  const ipfsHash = result.cid.toString();

  console.log('IPFS Hash:', ipfsHash);
  return ipfsHash;
}

module.exports = {
  addTextToIPFS,
  getTextFromIPFS,
  uploadImageToIPFS
};