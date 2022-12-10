const { Alchemy, Network } = require("alchemy-sdk");
const env = require('dotenv').config()
const fs = require('fs')

API_KEY=process.env.ALCHEMY_API_KEY;

const config = {
    apiKey: API_KEY,
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);
// console.log(config.network)

const main = async () => {

    // TK - Eternal Garden contract address
    const address = "0xa76cb9106781fa1eda36b6d369d398b383278283";

    // Get owners 
    const owners = await alchemy.nft.getOwnersForContract(address);
    console.log(owners);
    fs.writeFileSync('nft_holders.json', JSON.stringify(owners));
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();