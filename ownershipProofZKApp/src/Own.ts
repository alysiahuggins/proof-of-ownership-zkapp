import { Field, SmartContract, state, State, method, isReady, DeployArgs,
    Permissions,
    UInt64,
    UInt32,
    CircuitValue,
    prop,
    Poseidon,
    CircuitString,
    MerkleTree,
    MerkleWitness,
    PublicKey
} from 'snarkyjs';
import { nft_holders } from '../nft_holders/nft_holders.js';

await isReady; //comment this when deploying to berkeley, uncomment when running locally
let initialBalance = 100_000_000_000;
let nftHoldersTree = new MerkleTree(10);
let validatedNFTHoldersTree = new MerkleTree(10);
export class NFTHolderWitness extends MerkleWitness(10) {}


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

export function createNFTHoldersMerkleTree(){
    //generates the merkle tree from the list of nft holders
    for(let i in nft_holders){
        let thisHolder = new NFTHolder(CircuitString.fromString(nft_holders[i]));
        nftHoldersTree.setLeaf(BigInt(i), thisHolder.hash());
    }
  
    // now that we got our accounts set up, we need the commitment to deploy our contract!
    return nftHoldersTree;
}


export class Own extends SmartContract {
    @state(Field) commitmentNFTHolders = State<Field>();
    @state(Field) validatedNFTHoldersTotal = State<Field>();
    @state(Field) commitmentValidatedNFTHolders = State<Field>();


    deploy(args: DeployArgs){
        super.deploy(args);
        this.setPermissions({
                ...Permissions.default(),
                editState: Permissions.proofOrSignature(),
              });
      this.balance.addInPlace(UInt64.from(initialBalance)); //comment this for deployment to berkeley
    }
  
    init() {
        super.init();

        //store the root of the merkle tree in the app state
        this.commitmentNFTHolders.set(createNFTHoldersMerkleTree().getRoot());
        this.validatedNFTHoldersTotal.set(Field(0));

    }

    @method validateNFTHolder(nftHolder: NFTHolder, path: NFTHolderWitness){
        let commitment = this.commitmentNFTHolders.get();
        this.commitmentNFTHolders.assertEquals(commitment);
    
        // we check that the response is the same as the hash of the answer at that path
        path.calculateRoot(Poseidon.hash(nftHolder.toFields())).assertEquals(commitment);
    }

    @method validateAndStoreNFTHolder(nftHolder: NFTHolder, path: NFTHolderWitness, minaAddress: NFTHolder){
        let commitment = this.commitmentNFTHolders.get();
        this.commitmentNFTHolders.assertEquals(commitment);
    
        // we check that the response is the same as the hash of the answer at that path
        path.calculateRoot(Poseidon.hash(nftHolder.toFields())).assertEquals(commitment);

        //get the number of Holders in the smartContract
        let numHolders = this.validatedNFTHoldersTotal.get();
        this.validatedNFTHoldersTotal.assertEquals(numHolders);

        //calculate a new root at the path where that item should be
        let newCommitment = path.calculateRoot(minaAddress.hash());
        //update validatedNFTHolders state
        this.commitmentValidatedNFTHolders.set(newCommitment);

        //increase the number of holders
        numHolders = numHolders.add(1);
        //update number of holders state
        this.validatedNFTHoldersTotal.set(numHolders);
    }

    @method verifyAlreadyValidated(nftHolder: NFTHolder, path: NFTHolderWitness){
        let commitment = this.commitmentValidatedNFTHolders.get();
        this.commitmentValidatedNFTHolders.assertEquals(commitment);
    
        // we check that the response is the same as the hash of the answer at that path
        path.calculateRoot(Poseidon.hash(nftHolder.toFields())).assertEquals(commitment);
    }


  }
  