async function main() {
    const { createHelia } = await import('helia')
    const { json } = await import('@helia/json')
    const helia = await createHelia()
    const j = json(helia)

    const myImmutableAddress = await j.add({ hello: 'world' })

    console.log(await j.get(myImmutableAddress))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});