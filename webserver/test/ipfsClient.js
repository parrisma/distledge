async function main() {
    const { create } = await import('ipfs-http-client')

    // connect using a URL
    const client = create(new URL('http://127.0.0.1:5001'))

    // call Core API methods
    const { cid } = await client.add('Hello digital gargage team!')

    console.log(cid)

    const chunks = [];
    for await (const chunk of client.cat(cid)) {
        chunks.push(chunk);
    }

    console.log("Retrieved file contents:", chunks.toString());
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})