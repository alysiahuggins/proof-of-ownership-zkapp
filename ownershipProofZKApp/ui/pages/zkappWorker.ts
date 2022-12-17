import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
  MerkleTree,
  UInt32,
  CircuitValue,
  prop,
  Poseidon,
  MerkleWitness,
  Experimental,
  AccountUpdate,
  UInt64,
  CircuitString,
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Own } from '../../build/src/Own.js';
// import  { createNFTHoldersMerkleTree, NFTHolderWitness, NFTHolder } from '../../../build/src/Own.js';
import { nft_holders } from '../../nft_holders/nft_holders.js';

// import { MyMerkleWitness } from '../../contracts/src/Classes';

let proofsEnabled = false;
let initialBalance = 100_000_000_000;

export class NFTHolderWitness extends MerkleWitness(10) {}

export function createNFTHoldersMerkleTree(){
  //generates the merkle tree from the list of nft holders
  let nftHoldersTree = new MerkleTree(10);

  for(let i in nft_holders){
      let thisHolder = new NFTHolder(CircuitString.fromString(nft_holders[i]));
      nftHoldersTree.setLeaf(BigInt(i), thisHolder.hash());
  }

  // now that we got our accounts set up, we need the commitment to deploy our contract!
  return nftHoldersTree;
}


export class NFTHolder extends CircuitValue {
  @prop address: CircuitString;

  constructor(address: CircuitString) {
    super(address);
    this.address = address;
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}

export class Answer extends CircuitValue {
  @prop answer: UInt32;

  constructor(answer: UInt32) {
    super(answer);
    this.answer = answer;
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}

const state = {
  zkapp: null as null | Own,
  transaction: null as null | Transaction,
  Own: null as null | typeof Own,
  nftHoldersTree: null as null | MerkleTree,
  deployerAccount: null as null | PrivateKey,
  zkappPublicKey: null as null | PublicKey,
  zkappPrivateKey: null as null | PrivateKey
}

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.BerkeleyQANet(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  setActiveInstanceToLocal: async (args: {}) => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    state.deployerAccount = Local.testAccounts[0].privateKey;
    state.zkappPrivateKey = PrivateKey.random();
    state.zkappPublicKey = state.zkappPrivateKey.toPublicKey();

  },
  loadContract: async (args: {}) => {
    const { Own } = await import('../../build/src/Own.js');
    state.Own = Own;
    state.zkapp = new state.Own!(state.zkappPublicKey!);

    // console.log("verificationKey");
    // const verificationKey = await YKProof.compile();
    // // console.log(verificationKey);
    // console.log(verificationKey.verificationKey.hash);

  },
  compileContract: async (args: {}) => {
    console.log("verificationKey");
    const verificationKey = await state.Own!.compile();
    console.log(verificationKey.verificationKey.hash);


  },
  deployContract: async (args: {}) => {
    const txn = await Mina.transaction(state.deployerAccount!, () => {
      AccountUpdate.fundNewAccount(state.deployerAccount!, { initialBalance });
      state.zkapp!.deploy({  zkappKey: state.zkappPrivateKey!  });
    });
    // await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([state.zkappPrivateKey!]).send();
  },
  initContract: async (args: {}) => {
    let initTx = await Mina.transaction(state.deployerAccount!, () => {
      state.zkapp!.init();
      state.zkapp!.sign(state.zkappPrivateKey!);

    });
    // await initTx.prove();
    await initTx.send();


    let nftHoldersTree = new MerkleTree(10);
    nftHoldersTree = createNFTHoldersMerkleTree();
    state.nftHoldersTree = nftHoldersTree;
  },
  
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    const account = await fetchAccount({ publicKey });
    return account;
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Own!(publicKey);
    state.zkappPublicKey = publicKey;

    let nftHoldersTree = new MerkleTree(10);
    nftHoldersTree = createNFTHoldersMerkleTree();
    state.nftHoldersTree = nftHoldersTree;
  },
  getCommitmentNFTHolders: async (args: {}) => {
    const currentNum = await state.zkapp!.commitmentNFTHolders.get();
    return JSON.stringify(currentNum);
  },
  createValidateNFTHolderTransaction: async (args: {response: string, holderPosition: string}) => {
    try{
      console.log(args.response);
      console.log(args.holderPosition);
      let w = state.nftHoldersTree!.getWitness(BigInt(args.holderPosition));
      let witness = new NFTHolderWitness(w);
      const transaction = await Mina.transaction(() => {
          state.zkapp!.validateNFTHolder(new NFTHolder(CircuitString.fromString((args.response))), witness);
        }
      );
      state.transaction = transaction;
      return true;
    }catch(e){ 
      console.log("error from create tx")
      console.log(e)
      return false;
    }
  },
  createValidateAndStoreNFTHolderTransaction: async (args: {response: string, holderPosition: string, minaAddress: string}) => {
    try{
      console.log(args.response);
      console.log(args.holderPosition);
      console.log(args.minaAddress);
      let w = state.nftHoldersTree!.getWitness(BigInt(args.holderPosition));
      let witness = new NFTHolderWitness(w);
      let minaHolder = new NFTHolder(CircuitString.fromString(args.minaAddress));
      const transaction = await Mina.transaction(() => {
          state.zkapp!.validateAndStoreNFTHolder(new NFTHolder(CircuitString.fromString((args.response))),
          witness,
          minaHolder);
        }
      );
      state.transaction = transaction;
      return true;
    }catch(e){ 
      console.log("error from create tx")
      console.log(e)
      return false;
    }
  },
  createLogInTransaction: async (args: {response: string, holderPosition: string}) => {
    try{
      console.log(args.response);
      console.log(args.holderPosition);
      let w = state.nftHoldersTree!.getWitness(BigInt(args.holderPosition));
      let witness = new NFTHolderWitness(w);
      const transaction = await Mina.transaction(() => {
          state.zkapp!.verifyAlreadyValidated(
            new NFTHolder(CircuitString.fromString((args.response))),
          witness);
        }
      );
      state.transaction = transaction;
      return true;
    }catch(e){ 
      console.log("error from create tx")
      console.log(e)
      return false;
    }
  },

  sendValidateNFTHolderTransactionLocal: async (args: {response: string, holderPosition: string}) => {
    try{
      console.log(args.response);
      console.log(args.holderPosition);
      let w = state.nftHoldersTree!.getWitness(BigInt(args.holderPosition));
      let witness = new NFTHolderWitness(w);
      const transaction = await Mina.transaction(state.deployerAccount!, () => {
           state.zkapp!.validateNFTHolder(new NFTHolder(CircuitString.fromString((args.response))), witness);
            state.zkapp!.sign(state.zkappPrivateKey!);
          }
      );

      state.transaction = transaction;
      
      state.transaction!.prove();
      state.transaction!.send();
      console.log('successfully')
      return true;
    }catch(e){ 
      console.log("error from create tx")
      console.log(e)
      return false;
    }
  },
  
  proveUpdateTransaction: async (args: {}) => {
    try{
      await state.transaction!.prove();
      return true;
    }catch(e){
      console.log("error from proof")
      console.log(e)
      return false;
    }
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
  getNumValidatedNFTHolders: async (args: {}) => {
    const currentNum = await state.zkapp!.validatedNFTHoldersTotal.get();
    return JSON.stringify(currentNum);
  },
  
  
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number,
  fn: WorkerFunctions,
  args: any
}

export type ZkappWorkerReponse = {
  id: number,
  data: any
}
if (process.browser) {
  addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
      id: event.data.id,
      data: returnData,
    }
    postMessage(message)
  });
}
