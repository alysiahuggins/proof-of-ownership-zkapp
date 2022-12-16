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

## Designing User Experience
**Current User Flow**
If a web2 website wants to prove that you own an item, you will need to supply your blockchain address (and the token ID of the item you own). By exposing your blockchain address, that website can now store that information about you and look up your financial information associated with that address. All the web2 website needs to know is that you own an item so that you can have access but instead they know much more.

**Proposed User Flow**
Instead, the user can supply its address to the zkApp, which will not be known by anyone, and the zkapp can prove whether they have ownership of the item. Once it has been proven, the website can allow them to create a regular account or perform some action. The website is now web2.5*. 

**Example Application**
I can then create a voting app on top of it, so something like Snapshot plus so that the user can vote on a particular outcome. 


## Tasks
- Figure out a way to use connect to metamask wallet within typescript code (DONE - see typescript-metamask folder as an example)
(Tutorial used: https://adeleyemahmud.com/2022/09/25/add-a-web3-connect-button-to-your-react-app-with-typescript-and-metamask/)
- How to get list of holders for a particular NFT collection (DONE - nft-holders folder for an example)
https://docs.alchemy.com/docs/how-to-get-a-list-of-nft-holders-for-a-given-collection
- How to retrieve the list holders in an Oracle on Mina (complete the tutorial on Mina https://docs.minaprotocol.com/zkapps/tutorials/oracle)
- Create an Oracle Smart Contract
    - create an mock API request
- Create the smart contract that allows the user to submit their wallet address and prove that they own an NFT within that collection 
- Store email addresses within my zkapp (may use merkle trees)
- Complete the offchain storage tutorial  https://docs.minaprotocol.com/zkapps/tutorials/offchain-storage
- Proving Ownership
    - Create a zkApp that checks to see whether the address supplied is in a list of addresses (using merkle trees + zk smart contract) (DONE)
        - If it is, store the user Mina address as an allowed voter in offchain storage (using merkle trees + zk Smart contract (same smart contract as above))
- Performing Actions
    - Check to see if Mina address is in allowed voters (get data from offchain merkle tree + zk Smart Contract)
        - Allow user to vote annonymously & tally votes (how do you get the info from that position in the merkle tree? - try the merkle tree example and see if you can figure it out)
- Create a Front-end that allows the user to
    - Prove Ownership
        - connect to ETH button (DONE)
        - connect to Mina Button (DONE)
        - one button to connect wallets
        - allow switch Account with Metamask
    - Connect Frontend to Berkeley (DONE)
    - Sign Up Button
    - Sign In Button
    - Offchain Storage for users who have signed up
    - Submit an email address associated with their account
    - Update an email address associated with their account
    - Show authenticated users the information they are seeking
    - Allow authenticated users to sign into the app with their ETH address once they have authenticated once
    - Create widget
    - Create Example App that uses it e.g. a Voting app
- Testing
- Create Presentation
- UI Adjustment
- Create a sample app that can make use of your proof-of-ownership app



## Crunch Time ToDos
- Test adding multiple addresses to validation list
- Login with a transaction
- Check out leaderboard app and see if voting can work
- implement voting smart contract
- display voting option





## Technical Challenges
- Cannot verify an ETH signature on Mina
    - Solution
        - Let user connect to metamask wallet with the address that contains the asset so that we can prove that they operate the wallet that owns the address

- What do you store about the user when they verify their ETH address
    - the user can store a username
    - the app that wants to prove ownership for the user would then check to see if the user exists with that application
    - that app can then ask the user for other details if it needs too, example, email addresses.

- How do you expire a connection?
    - save this for another time, it's not needed in the proof of concept

- How do you make sure that this wallet address didn't already athenticate and create a user within the app?
    - store a list of addresses that have already authenticated and the last auth time

- List of ETH addresses can be large (causes extreme slowness and/or overflow errors in proof)
    - Idea: Build some kind of ordering/batching system so you only need to prove something small (along the lines of assert(address is in addresesStartingWithA), rather than assert(address is in addreses))
    - Idea: Use a MerkleTree or MerkleMap for addresses rather than a list




## Product Challenges
- How long is the user authenticated for?  A user may sell its NFT and no longer have access
- - Can update the list of holders daily

- What makes this solution so different from patreon themself implementing metamask wallet access?
    - You don't leak your ETH holdings to Patreon or any other website that uses this tool
    - You don't leak which application you want to authenticate with to anyone else
    - You could use this portable proof system on "any website" - maybe bring thr focus to the tech as a passport rather than the single app of a patreon clone


## Deployment Details
Address = B62qmJHgz9hq2Jxsz7DLXUCN3j7sioJb2BLoknqzLb4iyBSknPAJFsW
Deployment transaction = https://berkeley.minaexplorer.com/transaction/Ckpa7VhZLcUeuKpAEDAqGpd1nEgMzHbtKhiVvZ9PaoqHYAENzcvYD

## Run Berkeley Tester locally
`npm run build && node build/src/mainYKBerkeley.js berkeley `

## Thank You's
*Thank you to 45930 on discord and JenPaff for help me talk through the idea and discuss the technical challenges over the weekend* 