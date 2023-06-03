const fs = require('fs');

async function startIpfs() {
  const { create } = await import('ipfs-core')
  ipfs = await create()
  const config = await ipfs.config.getAll();
  console.log(config) 
  console.log('IPFS node is ready');
}

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
  uploadImageToIPFS,
  startIpfs
};