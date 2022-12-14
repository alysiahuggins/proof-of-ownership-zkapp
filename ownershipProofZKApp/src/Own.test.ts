import { Own, NFTHolder, createNFTHoldersMerkleTree, NFTHolderWitness } from './Own';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  CircuitString,
} from 'snarkyjs';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;
let initialBalance = 100_000_000_000;


describe('Own', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Own;

  beforeAll(async () => {
    await isReady;
    if (proofsEnabled) Own.compile();

    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    deployerAccount = Local.testAccounts[0].privateKey;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Own(zkAppAddress);

    console.log("deploying")
    await localDeploy();
    console.log("initializing")
    await init();
  });


  afterAll(() => {
    // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
    // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
    // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
    setTimeout(shutdown, 0);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount, { initialBalance });
      zkApp.deploy({  zkappKey: zkAppPrivateKey  });
    });
    // await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([zkAppPrivateKey]).send();
  }

  async function init(){
    let initTx = await Mina.transaction(deployerAccount, () => {
        zkApp.init();
        zkApp.sign(zkAppPrivateKey);
  
    });
    // await initTx.prove();
    await initTx.send();
    console.log('Own init');
  }
  

  it('generates and deploys the `Own` smart contract', async () => {
    
    const commitment = zkApp.commitmentNFTHolders.get();
    console.log(commitment.toString())
    expect(commitment).toEqual(Field("19500543247797079170250155519623097781256876506498328163677247554333433174572"));
  });

  it('validate the first item in the merkle tree in the `Own` smart contract', async () => {
    const merkleTree = createNFTHoldersMerkleTree();
    let w = merkleTree.getWitness(BigInt(0));
    let witness = new NFTHolderWitness(w);
    let result = false;
    try{
        let txn = await Mina.transaction(deployerAccount, () => {
            zkApp.validateNFTHolder(new NFTHolder(CircuitString.fromString("0x00bd58530a64b04f552f2f6a8319e91d70f6b12b")),  witness);
            zkApp.sign(zkAppPrivateKey);
    
        });
        console.log(`Sending blockchain transaction for question ${0}`)
        await txn.send();
        result = true;

    }catch(e){
        result = false;
    }
    
    expect(result).toEqual(true);
  });

  it('validate the wrong address is not in the merkle tree in the `Own` smart contract', async () => {
    const merkleTree = createNFTHoldersMerkleTree();
    let w = merkleTree.getWitness(BigInt(0));
    let witness = new NFTHolderWitness(w);
    let result = false;
    try{
        let txn = await Mina.transaction(deployerAccount, () => {
            zkApp.validateNFTHolder(new NFTHolder(CircuitString.fromString("0x00bd1234a64b04f552f2f6a8319e91d70f6b12b")),  witness);
            zkApp.sign(zkAppPrivateKey);
    
        });
        console.log(`Sending blockchain transaction for question ${0}`)
        await txn.send();
        result = true;

    }catch(e){
        result = false;
    }
    
    expect(result).toEqual(false);
  });

//   it('correctly updates the num state on the `Add` smart contract', async () => {
//     await localDeploy();

//     // update transaction
//     const txn = await Mina.transaction(deployerAccount, () => {
//       zkApp.update();
//     });
//     await txn.prove();
//     await txn.send();

//     const updatedNum = zkApp.num.get();
//     expect(updatedNum).toEqual(Field(3));
//   });
});
