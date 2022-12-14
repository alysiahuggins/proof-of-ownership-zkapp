import { Own } from './Own';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
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
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    deployerAccount = Local.testAccounts[0].privateKey;
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Own(zkAppAddress);
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
    console.log("deploying")
    await localDeploy();
    console.log("initializing")
    await init();
    const commitment = zkApp.commitmentNFTHolders.get();
    console.log(commitment.toString())
    expect(commitment).toEqual(Field("19500543247797079170250155519623097781256876506498328163677247554333433174572"));
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
