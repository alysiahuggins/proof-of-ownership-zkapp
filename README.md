# proof-of-ownership-zkapp
Building this project on the Mina Blockchain as part of the zk-ignite program https://minaprotocol.com/blog/zkignite-cohort0

## Objective
- Prove ownership of a digital collection without revealing your blockchain address and which item you own.

## ZkApp Concerns
**Private Input**
- Your ETH Address, 
- Optional {NFT collection, NFT ID within the NFT collection}
**External Data**
- Blockchain Data about the NFT collection
- - Optional {NFT IDs, Owner of NFT}
- List of holders of that collection
- Access to information behind the wall garden (required for the client side but not the smart contract itself)
**Data Stored on Smart Contract**
- email addresses and/or usernames of the persons who have proved that they own an NFT within that collection 

*Questions*
- How do you prove that the ethereum address that they are authenticating is actually the one they own?
- - Possible Solution: Include the web3.js library and have them connect that wallet to the app, so that way the only way they can own the address is if it's in their metamask wallet. SOLVED (see the first bullet in the task list)


## Tasks
- Figure out a way to use connect to metamask wallet within typescript code DONE (see typescript-metamask folder as an example)
(Tutorial used: https://adeleyemahmud.com/2022/09/25/add-a-web3-connect-button-to-your-react-app-with-typescript-and-metamask/)
- How to get list of holders for a particular NFT collection *(Blocker)*
- How to retrieve the list holders in an Oracle on Mina (complete the tutorial on Mina https://docs.minaprotocol.com/zkapps/tutorials/oracle)
- Create the smart contract that allows the user to submit their wallet address and prove that they own an NFT within that collection 
- Store email addresses within my zkapp (may use merkle trees)
- Complete the offchain storage tutorial  https://docs.minaprotocol.com/zkapps/tutorials/offchain-storage
- Create a Front-end that allows the user to
- - Prove Ownership
- - Submit an email address associated with their account
- - Update an email address associated with their account
- - Show authenticated users the information they are seeking
- - Allow authenticated users to sign into the app with their ETH address once they have authenticated once
- Testing
- Create Presentation
- UI Adjustment
