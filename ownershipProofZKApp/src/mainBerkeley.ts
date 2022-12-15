


import { Own, NFTHolder,NFTHolderWitness,createNFTHoldersMerkleTree } from './Own.js';
import {
  isReady,
  shutdown,
  Mina,
  PrivateKey,
  PublicKey,
  Field,
  fetchAccount,
  AccountUpdate,
  CircuitString,
  MerkleTree,
  MerkleWitness,
  CircuitValue,
  prop,
  Poseidon,
  UInt32,
  Ledger
} from 'snarkyjs';

import fs from 'fs';
import { loopUntilAccountExists, zkAppNeedsInitialization, makeAndSendTransaction } from './utils.js';
import { AppRegisteredEventsDocument } from '@superfluid-finance/sdk-core/dist/module/subgraph/events/events.generated.js';


  
const nftHoldersTree = createNFTHoldersMerkleTree()





export const deploy = async (
    deployerPrivateKey: PrivateKey,
    zkAppPrivateKey: PrivateKey,
    zkAppPublicKey: PublicKey,
    zkapp: Own,
    verificationKey: { data: string; hash: string | Field }
  ) => {
  let transactionFee = 100_000_000;

    console.log(
      'using deployer private key with public key',
      deployerPrivateKey.toPublicKey().toBase58()
    );
    console.log(
      'using zkApp private key with public key',
      zkAppPrivateKey.toPublicKey().toBase58()
    );
  
    // ----------------------------------------------------
  
    let zkAppResponse = await fetchAccount({ publicKey: zkAppPublicKey });
    let isDeployed = zkAppResponse.error == null;
    // TODO add check that verification key is correct once this is available in SnarkyJS
    let zkappVerificationKey = zkAppResponse.account!.verificationKey!.toString()
    isDeployed = isDeployed && (zkappVerificationKey==verificationKey.data);
    console.log(zkappVerificationKey)
    console.log()
    console.log(verificationKey.data)

    // ----------------------------------------------------
  
    if (isDeployed) {
      console.log(
        'zkApp for public key',
        zkAppPublicKey.toBase58(),
        'found deployed'
      );
    } 
    // else {
    //   console.log('Deploying zkapp for public key', zkAppPublicKey.toBase58());
    //   let transaction = await Mina.transaction(
    //     { feePayerKey: deployerPrivateKey, fee: transactionFee },
    //     () => {
    //       AccountUpdate.fundNewAccount(deployerPrivateKey);
    //       zkapp.deploy({ zkappKey: zkAppPrivateKey, verificationKey });
    //     }
    //   );
  
    //   console.log('Sending the deploy transaction...');
    //   const res = await transaction.send();
    //   const hash = await res.hash(); // This will change in a future version of SnarkyJS
    //   if (hash == null) {
    //     console.log('error sending transaction (see above)');
    //   } else {
    //     console.log(
    //       'See deploy transaction at',
    //       'https://berkeley.minaexplorer.com/transaction/' + hash
    //     );
    //   }
    // }
  
    // ----------------------------------------------------
  
    return isDeployed;
  };
  

(async function main() {
  await isReady;
  console.log('SnarkyJS loaded');
  // ----------------------------------------------------

  // ----------------------------------------------------
  const Berkeley = Mina.Network(
    'https://proxy.berkeley.minaexplorer.com/graphql'
  );
  Mina.setActiveInstance(Berkeley);
  let transactionFee = 100_000_000;
  // ----------------------------------------------------...


  const deployAlias = process.argv[2];
  const deployerKeysFileContents = fs.readFileSync(
    'keys/' + deployAlias + '.json',
    'utf8'
  );
  const deployerPrivateKeyBase58 = JSON.parse(
    deployerKeysFileContents
  ).privateKey;
  const deployerPrivateKey = PrivateKey.fromBase58(deployerPrivateKeyBase58);
  const zkAppPrivateKey = deployerPrivateKey;
  // ----------------------------------------------------

  console.log('Compiling smart contract...');
  let { verificationKey } = await Own.compile();
  console.log(`zk app verification key ${verificationKey.hash}`);
 
  const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
  let zkapp = new Own(zkAppPublicKey);


   // ----------------------------------------------------
   let zkAppResponse = await fetchAccount({ publicKey: zkAppPublicKey });
   let isDeployed = zkAppResponse.error == null;
   // TODO add check that verification key is correct once this is available in SnarkyJS

   //   Besides the CLI, you can also create accounts programmatically. This is useful if you need
   //   more custom account creation - say deploying a zkApp to a different key than the deployer
   //   key, programmatically parameterizing a zkApp before initializing it, or creating Smart
   //   Contracts programmatically for users as part of an application.
   await deploy(deployerPrivateKey, zkAppPrivateKey, zkAppPublicKey, zkapp, verificationKey)
   // ----------------------------------------------------
 
  // ----------------------------------------------------
  let zkAppAccount = await loopUntilAccountExists({
    account: zkAppPrivateKey.toPublicKey(),
    eachTimeNotExist: () => console.log('waiting for zkApp account to be deployed...'),
    isZkAppAccount: true
  });
  // ----------------------------------------------------...
   
    
    
  // ----------------------------------------------------

  const needsInitialization = await zkAppNeedsInitialization({ zkAppAccount });


    if (needsInitialization) {
    console.log('initializing smart contract');

    console.log(zkapp.commitmentNFTHolders.get().toString());
    await makeAndSendTransaction({
        feePayerPrivateKey: deployerPrivateKey,
        zkAppPublicKey: zkAppPublicKey,
        signZkApp: () => zkapp.sign(deployerPrivateKey),
        mutateZkApp: () => zkapp.init(),
        transactionFee: transactionFee,
        getState: () => zkapp.commitmentNFTHolders.get(),
        statesEqual: (num1 , num2) => num1.equals(num2).toBoolean()
    });
    console.log('updated state!', zkapp.commitmentNFTHolders.get().toString());
    }
    let num = (await zkapp.commitmentNFTHolders.get())!;
    console.log('current value of num is', num.toString());

 

  // ----------------------------------------------------
  

  // ----------------------------------------------------

  // ----------------------------------------------------
         let w = nftHoldersTree.getWitness(BigInt(0));
         let witness = new NFTHolderWitness(w);

         let txn = await Mina.transaction({ feePayerKey: deployerPrivateKey, fee: transactionFee },
            () => {
            zkapp.validateNFTHolder(new NFTHolder(CircuitString.fromString("0x00bd58530a64b04f552f2f6a8319e91d70f6b12b")),
           witness);
            zkapp.sign(deployerPrivateKey);
    
          });
    
          // fill in the proof - this can take a while...
        console.log('Creating an execution proof...');
        let time0 = Date.now();
        await txn.prove();
        let time1 = Date.now();
        console.log('creating proof took', (time1 - time0) / 1e3, 'seconds');
      
        console.log('Sending the transaction...');
        let res = await txn.send();
        let hash = await res.hash(); // This will change in a future version of SnarkyJS
        if (hash == null) {
          console.log('error sending transaction (see above)');
        } else {
          console.log(
            'See transaction at',
            'https://berkeley.minaexplorer.com/transaction/' + hash
          );
        }
         // ----------------------------------------------------
 
  console.log('Shutting down');
  await shutdown();
})();

