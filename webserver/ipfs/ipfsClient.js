const IPFS_URL = process.env.IPFS_URL || "http://localhost:5001";
const fs = require('fs');

async function addTextToIPFS(data) {
  const { create } = await import('ipfs-http-client')
  const ipfs = create('/ip4/127.0.0.1/tcp/5001');
  // const ipfs = create({
  //   grpc: '/ip4/127.0.0.1/tcp/5003/ws',
  //   http: '/ip4/127.0.0.1/tcp/5002/http'
  // })
  const result = await ipfs.add(data);
  const ipfsHash = result.cid.toString();
  console.log('IPFS Hash:', ipfsHash);
  return ipfsHash;
}

async function getTextFromIPFS(ipfsHash) {
  const { create } = await import('ipfs-http-client')
  const ipfs = create('/ip4/127.0.0.1/tcp/5001');
  // const ipfs = create({
  //   grpc: '/ip4/127.0.0.1/tcp/5003/ws',
  //   http: '/ip4/127.0.0.1/tcp/5002/http'
  // })
  let text = ''
  const decoder = new TextDecoder()
  for await (const chunk of ipfs.cat(ipfsHash)) {
    text += decoder.decode(chunk, {
      stream: true
    })
  }
  console.log("Retrieved file contents:", text);
  return JSON.parse(text);
}

async function uploadImageToIPFS(imagePath) {
  const { create } = await import('ipfs-http-client')
  const ipfs = create('/ip4/127.0.0.1/tcp/5001');
  // const ipfs = create({
  //   grpc: '/ip4/127.0.0.1/tcp/5003/ws',
  //   http: '/ip4/127.0.0.1/tcp/5002/http'
  // })

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