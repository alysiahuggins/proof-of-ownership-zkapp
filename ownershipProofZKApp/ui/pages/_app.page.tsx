import '/styles/globals.css'
// import '/styles/styles.css'

import { useEffect, useState } from "react";
import './reactCOIServiceWorker';
import { Container, Row, Col, Button, Card, Form, Spinner, InputGroup, ListGroup, Alert } from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css';


import ConfettiExplosion from 'react-confetti-explosion';

import ZkappWorkerClient from './zkappWorkerClient';
import * as ls from "local-storage";

import {
  PublicKey,
  PrivateKey,
  Field,
  shutdown,
} from 'snarkyjs'
import { nft_holders } from '../../nft_holders/nft_holders';

// import {questionsRadio as questionsRadio} from "../../../quiz-app/src/curriculum/curriculum.js";
// import {answers as answers} from "../../../quiz-app/src/curriculum/curriculum.js";
let index = 0;
let validatedAddresses: string[] = [];

let transactionFee = 0.1;
export default function App() {

  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
    claimRewardsDisabled: true,
    walletConnected: false,
    validatedAddresses: null as null | string [],
    loggedIn: false,
  });

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        validatedAddresses = ls.get('validatedAddresses');
        console.log(`validatedAddresses`)
        console.log(validatedAddresses);
        const zkappWorkerClient = new ZkappWorkerClient();
        
        console.log('Loading SnarkyJS...');
        await zkappWorkerClient.loadSnarkyJS();
        setState({ ...state, zkappWorkerClient: zkappWorkerClient });

        console.log('done');

        await zkappWorkerClient.setActiveInstanceToBerkeley();
        // await zkappWorkerClient.setActiveInstanceToLocal();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        

        // const publicKeyBase58 : string = (await mina.requestAccounts())[0];
        // const publicKey = PublicKey.fromBase58(publicKeyBase58);

        // console.log('using key', publicKey.toBase58());

        // console.log('checking if account exists...');
        // const res = await zkappWorkerClient.fetchAccount({ publicKey: publicKey! });
        // const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log('compiling zkApp');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');

        const zkappPublicKey = PublicKey.fromBase58('B62qmJHgz9hq2Jxsz7DLXUCN3j7sioJb2BLoknqzLb4iyBSknPAJFsW');

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
        
        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey })
        const currentNum = await zkappWorkerClient.getCommitmentNFTHolders();
        console.log('current state:', currentNum.toString());

        setState({ 
            ...state, 
            zkappWorkerClient, 
            hasWallet: true,
            hasBeenSetup: true, 
            // publicKey, 
            zkappPublicKey: zkappPublicKey, 
            // accountExists, 
            currentNum: currentNum,
            validatedAddresses: validatedAddresses
        });
      }
    })();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  // useEffect(() => {
  //   (async () => {
  //     // if (state.hasBeenSetup && !state.accountExists) {
  //     if (state.hasBeenSetup) {

  //       for (;;) {
  //         console.log('checking if account exists...');
  //         const res = await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! })
  //         const accountExists = res.error == null;
  //         if (accountExists) {
  //           break;
  //         }
  //         await new Promise((resolve) => setTimeout(resolve, 5000));
  //       }
  //       setState({ ...state, accountExists: true });
  //     }
  //   })();
  // }, [state.hasBeenSetup]);

  // -------------------------------------------------------
  // Send a transaction

  // const onSendTransaction = async (response:number, questionPosition:number) => {
  //   try{
  //     setState({ ...state, creatingTransaction: true });
  //     setLoadTxnClass('d-block');
  //     console.log('sending a transaction...');

  //     await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! });

  //     let txCreated = await state.zkappWorkerClient!.createUpdateTransaction(response, questionPosition);
  //     if(txCreated){
  //       console.log('creating proof...');
  //       await state.zkappWorkerClient!.proveUpdateTransaction();

  //       console.log('getting Transaction JSON...');
  //       const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON()
  //       console.log(transactionJSON);
  //       console.log('requesting send transaction...');
  //       const { hash } = await (window as any).mina.sendTransaction({
  //         transaction: transactionJSON,
  //         feePayer: {
  //           fee: transactionFee,
  //           memo: '',
  //         },
  //       });

  //       console.log(
  //         'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
  //       );
  //       txns.push('https://berkeley.minaexplorer.com/transaction/' + hash);
  //       setState({ ...state, creatingTransaction: false });
  //       setLoadTxnClass('d-none');
  //       setClaimViewClass('d-none');

  //       return true;

  //     }else{
  //       setState({ ...state, creatingTransaction: false });
  //       setLoadTxnClass('d-none');
  //       setClaimViewClass('d-none');

  //       return false;
  //     }
      
      
  //   }catch(e){
  //     setState({ ...state, creatingTransaction: false });
  //     setClaimViewClass('d-none');
  //     setLoadTxnClass('d-none');

  //     console.log("error caught")
  //     console.log(e)
  //     return false
  //   }

    
  // }

  // -------------------------------------------------------
  // // Send a transaction - Claim Rewards

  // const onClaimRewardsTransaction = async (publicKeyBase58:string) => {
  //   try{

  //     setShowConfetti(false);

  //     console.log('sending a transaction...');
  //     setState({ ...state, creatingTransaction: true });
  //     setLoadTxnClass('d-block');

  //     // let tokenBalance = await state.zkappWorkerClient!.getTokenBalance(publicKeyBase58);
  //     // console.log("tokenBalance");
  //     // console.log(tokenBalance);
  //     // if(tokenBalance==-1){
  //     //   console.log('You need to do a tokendeploy to that address first');
  //     // }
  //     // await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! });
  //     let txCreated = await state.zkappWorkerClient!.createClaimRewardsTransaction(publicKeyBase58);

  //     if(txCreated){
  //       console.log('creating proof...');
  //       await state.zkappWorkerClient!.proveUpdateTransaction();

  //       console.log('getting Transaction JSON...');
  //       const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON()
  //       console.log(transactionJSON);
  //       console.log('requesting send transaction...');
  //       const { hash } = await (window as any).mina.sendTransaction({
  //         transaction: transactionJSON,
  //         feePayer: {
  //           fee: transactionFee,
  //           memo: '',
  //         },
  //       });

  //       console.log(
  //         'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
  //       );
  //       txns.push('https://berkeley.minaexplorer.com/transaction/' + hash);
  //       setState({ ...state, creatingTransaction: false });
  //       setLoadTxnClass('d-none');
  //       setClaimViewClass('d-none');

  //       return true;

  //     }else{
  //       setState({ ...state, creatingTransaction: false });
  //       setLoadTxnClass('d-none');

  //     }
      
      
  //   }catch(e){
  //     setState({ ...state, creatingTransaction: false });
  //     setLoadTxnClass('d-none');

  //     console.log("error caught")
  //     console.log(e)
  //     alert(`This error occurred when trying to create the transaction: ${e.message}`)
  //     return false
  //   }
    
  //   alert("An error occurred when trying to create the transcaction");
  //   return false;

  // }

  // -------------------------------------------------------
  // Validate Holder

  const onValidateHolder = async () => {
    try{
      setState({ ...state, creatingTransaction: true });
      setLoadTxnClass('d-block');
      console.log('sending a transaction...');

      // await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! });
      let itemIndex = -1;
      itemIndex = nft_holders.indexOf(ETHAccount!);
      console.log("itemIndex in nftHolders");
      console.log(itemIndex);
      
      let txCreated = await state.zkappWorkerClient!.createValidateNFTHolderTransaction(ETHAccount!, itemIndex.toString());
      if(txCreated){
        console.log('transaction created...now to prove it');
        await state.zkappWorkerClient!.proveUpdateTransaction();

        console.log('getting Transaction JSON...');
        const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON()
        console.log(transactionJSON);
        console.log('requesting send transaction...');
        const { hash } = await (window as any).mina.sendTransaction({
          transaction: transactionJSON,
          feePayer: {
            fee: transactionFee,
            memo: '',
          },
        });

        console.log(
          'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
        );
        txns.push('https://berkeley.minaexplorer.com/transaction/' + hash);
        setState({ ...state, creatingTransaction: false });
        setLoadTxnClass('d-none');
        setClaimViewClass('d-none');

        return true;

      }else{
        setState({ ...state, creatingTransaction: false });
        setLoadTxnClass('d-none');
        setClaimViewClass('d-none');
        alert("NFT Holder not found");
        return false;
    }
      
      
    }catch(e){
      setState({ ...state, creatingTransaction: false });
      setClaimViewClass('d-none');
      setLoadTxnClass('d-none');
      alert("NFT Holder not found");

      console.log("error caught")
      console.log(e)
      return false
    }

    
  }

  // -------------------------------------------------------
  // Sign Up Holder

  const onSignUp = async () => {
    try{
      setState({ ...state, creatingTransaction: true });
      setLoadTxnClass('d-block');
      console.log('sending a transaction...');

      // await state.zkappWorkerClient!.fetchAccount({ publicKey: state.publicKey! });
      let itemIndex = -1;
      itemIndex = nft_holders.indexOf(ETHAccount!);
      console.log("itemIndex in nftHolders");
      console.log(itemIndex);

      let txCreated = await state.zkappWorkerClient!.createValidateAndStoreNFTHolderTransaction(
        ETHAccount!, 
        itemIndex.toString(),
        state.publicKey!.toBase58()
      );
      if(txCreated){
        console.log('transaction created...now to prove it');
        await state.zkappWorkerClient!.proveUpdateTransaction();

        console.log('getting Transaction JSON...');
        const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON()
        console.log(transactionJSON);
        console.log('requesting send transaction...');
        const { hash } = await (window as any).mina.sendTransaction({
          transaction: transactionJSON,
          feePayer: {
            fee: transactionFee,
            memo: '',
          },
        });

        console.log(
          'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
        );
        txns.push('https://berkeley.minaexplorer.com/transaction/' + hash);
        setState({ ...state, creatingTransaction: false });
        setLoadTxnClass('d-none');
        setClaimViewClass('d-none');

        //TODO if tx successful, store validated holders locally
        console.log(`state.publicKey!`);
        console.log(state.publicKey!);
        if(validatedAddresses!=null) validatedAddresses.push(MinaAccount!);
        else validatedAddresses = [MinaAccount!]
        setState({ 
          ...state, 
          validatedAddresses: validatedAddresses
        });
        console.log("validated Addresses");
        console.log(state.validatedAddresses!);
        ls.set('validatedAddresses', validatedAddresses);
        let initialState = await state.zkappWorkerClient!.getNumValidatedNFTHolders();
        let appState = initialState;
        console.log(`initial State`);
        console.log(initialState);
        let stateChanged = false;
        while (!stateChanged) {
          console.log(
            'waiting for zkApp state to change... (current state: ',
            appState.toString() + ')'
          );
          await new Promise((resolve) => setTimeout(resolve, 5000));
          await state.zkappWorkerClient!.fetchAccount({ publicKey: state.zkappPublicKey! });
          appState = await state.zkappWorkerClient!.getNumValidatedNFTHolders();
          stateChanged = !initialState.equals(appState).toBoolean();
        }
        console.log(`Num validated holders changed from ${initialState} to ${appState}`);
        ls.set('numValidatedAddress', appState);
        return true;

      }else{
        setState({ ...state, creatingTransaction: false });
        setLoadTxnClass('d-none');
        setClaimViewClass('d-none');
        alert("NFT Holder not found");

        return false;
    }
      
      
    }catch(e){
      setState({ ...state, creatingTransaction: false });
      setClaimViewClass('d-none');
      setLoadTxnClass('d-none');
      alert("NFT Holder not found");

      console.log("error caught")
      console.log(e)
      return false
    }

    
  }

  // -------------------------------------------------------
  // Quick Login - Checks the local storage

  const onQuickLogin = async () => {
    try{
      if(state.loggedIn){
        onLogout();
      }else{
        setState({ ...state, creatingTransaction: true });
      setLoadTxnClass('d-block');
      console.log('sending a transaction...');

      validatedAddresses = ls.get('validatedAddresses');
      console.log(validatedAddresses);
      console.log(MinaAccount!);
      console.log(validatedAddresses.includes(MinaAccount!));
      if(validatedAddresses.includes(MinaAccount!)){
      
        setState({ ...state, creatingTransaction: false });
        setLoadTxnClass('d-none');
        setClaimViewClass('d-none');
        console.log('Logged in!')
        setState({ ...state, loggedIn: true });
          
        return true;

      }else{
        setState({ ...state, creatingTransaction: false });
        setLoadTxnClass('d-none');
        setClaimViewClass('d-none');
        console.log("not logged in");

        return false;
    }
      
      
    }
      }
      catch(e){
        setState({ ...state, creatingTransaction: false });
        setClaimViewClass('d-none');
        setLoadTxnClass('d-none');
  
        console.log("error caught")
        console.log(e)
        console.log("not logged in");
  
        return false
      }
      
  }


  // -------------------------------------------------------
  //  Logout - Checks the local storage

  const onLogout = async () => {
      if(state.loggedIn!){
        setState({ ...state, loggedIn: false });
        console.log('Logged out')
        return true;
      }
  }
  


  
  // -------------------------------------------------------
  // Refresh the current state

  const onRefreshCurrentNum = async () => {
    console.log('getting zkApp state...');
    await state.zkappWorkerClient!.fetchAccount({ publicKey: state.zkappPublicKey! })
    const currentNum = await state.zkappWorkerClient!.getCommitmentNFTHolders();
    console.log('current state:', currentNum.toString());

    setState({ ...state, currentNum });
  }
   // -------------------------------------------------------
  // Show the quiz screen

  const onRestartQuiz = async () => {
    setShowConfetti(false);

    setQuizContentClass("d-block");
    setClaimViewClass("d-none");
  }

  // -------------------------------------------------------
  // Other Methods
  const [item, setItem] = useState({ quizOption: "", another: "another", index:0 });

  const { quizOption: questionResponse } = item;
  const [txns, setTxns] = useState<string[]>([]); 
  const [claimViewClass, setClaimViewClass] = useState("d-none");
  const [quizContentClass, setQuizContentClass] = useState("d-block"); 
  const [loadTxnClass, setLoadTxnClass] = useState("d-none"); 
  const [showConfetti, setShowConfetti] = useState(false); 





  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    console.log(e.target.value);

    setItem(prevState => ({
      ...prevState,
      quizOption: e.target.value,
      // index: index+1
    }));
  };

  // const  handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {

  //   e.preventDefault();

  //   // e.persist();

  //   // alert(`${questionResponse}`);
  //   let formID = e.target.id;
  //   let questionNumber = parseInt(formID.split('-')[1]);
  //   let response = parseInt(questionResponse)+1;
  //   console.log(`${response} was the response to ${questionNumber}`);
  //   let result = false;
    
  //   try{
      
  //     result = await onSendTransaction(response,questionNumber);
  //     console.log(result)
  //     if (index<answers.length-1 && result) {
  //       console.log("set item")
  //       let newIndex = index+1;
  //       console.log(index,newIndex)
        
  //       setItem(prevState => ({
  //         ...prevState,
  //         index: index+1
  //       }));
  //       console.log(index)
  //       index = index+1
  
  //     }
  //     else if(index>=answers.length-1 && result) {
  //       index = 0;
  //       setItem(prevState => ({
  //         ...prevState,
  //         index: 0
  //       }));
  //       setClaimViewClass("d-block");
  //       setQuizContentClass("d-none");
  //       setShowConfetti(true);
  //       //wait 3 seconds so that the confetti can be shown
  //       await new Promise( resolve => setTimeout(resolve, 3000) )
  //       setShowConfetti(false);
  //     }
  //     else if(result==false){
  //       alert("Incorrect")

  //     }
  //   }catch(e){
  //     console.log('error encountered')
  //     console.log(e);
  //     alert("Incorrect")
  //   }
    
  // };

  // -------------------------------------------------------
  // Create UI elements

  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = 'https://www.aurowallet.com/';
    const auroLinkElem = <a href={auroLink} target="_blank" rel="noreferrer"> [Link] </a>
    hasWallet = <div> Could not find a wallet. Install Auro wallet here: { auroLinkElem }</div> 
  }

  let setupText = state.hasBeenSetup ? '' : 'Loading App...';

  let setupAnim = state.hasBeenSetup ? '' :
    <Spinner animation="grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>

  let loadingSpinner = 
  <Container  className="text-center">
    <Spinner animation="border" role="status" className={`text-center ${loadTxnClass}`}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>

  // let setup = <div> { setupText } { hasWallet }</div>
  let setup = <Container className="text-center"> { setupAnim } { hasWallet }</Container>
  
let confettiContent = showConfetti?<Container fluid="sm" className="text-center"><ConfettiExplosion  /></Container>:"";

  let accountDoesNotExist;
  // if (state.hasBeenSetup && !state.accountExists) {
  //   const faucetLink = "https://faucet.minaprotocol.com/?address=" + state.publicKey!.toBase58();
  //   accountDoesNotExist = <Container>
  //     Account does not exist. Please visit the faucet to fund this account
  //     <a href={faucetLink} target="_blank" rel="noreferrer"> [Link] </a>
  //   </Container>
  // }

  let checkEligibilityButton = 
  <Row>
    <Col>
      <Button  onClick={onValidateHolder} disabled={state.creatingTransaction} className={state.loggedIn?"d-none text-center":"d-block text-center"}> Check Eligibility </Button>
    </Col>
</Row>;

let signUpButton = 
<Row className={state.loggedIn!?"d-none text-center":"d-block text-center"}>
  <Col>
    <Button onClick={onSignUp} disabled={state.creatingTransaction} > Sign Up </Button>
  </Col>
</Row>;

let loginButton = 
<Row>
  <Col>
    <Button onClick={onQuickLogin} disabled={state.creatingTransaction}>{state.loggedIn!?"Log Out":"Log In"}</Button>
  </Col>
</Row>;

  let mainContent, validateContent, transactionContent;

  if (state.hasBeenSetup ) {

  // if (state.hasBeenSetup && state.accountExists) {
    mainContent = 
    // <div>
    //   <button onClick={() => onSendTransaction(4,0)} /*disabled={state.creatingTransaction}*/> Send Transaction </button>
    //   <div> Current Number in zkApp: { state.currentNum!.toString() } </div>
    //   <button onClick={onRefreshCurrentNum}> Get Latest State </button>
    // </div>
    <Container fluid="sm" className="text-center">
    <Row>
      <Col></Col>
      <Col>
        <Button  /*disabled={state.creatingTransaction}*/> Send Transaction </Button>

        {/* <Button onClick={() => onSendTransaction(4,0)} disabled={state.creatingTransaction}> Send Transaction </Button> */}
        <div> Current Number in zkApp: { state.currentNum!.toString() } </div>
        <Button onClick={onRefreshCurrentNum}> Get Latest State </Button>
      </Col>
      <Col></Col>
    </Row>
    </Container>;

    // quizContent = 
    //   <Container fluid="sm" className={`text-center ${quizContentClass}`} >
    //     <Row>
    //       <Col>
    //         <Form>
    //         <h3>{questionsRadio[index].question}</h3>
    //         <InputGroup>
    //         {/* {['checkbox', 'radio'].map((type) => (
    //       <div key={`default-${type}`} className="mb-3">
    //         <InputGroup.Radio
    //           type="radio"
    //           id={`default-${type}`}
    //           label={`default ${type}`}
    //         />
    //         <InputGroup.Radio aria-label="Radio button for following text input" />
    //       </div>
    //     ))} */}
    //     </InputGroup>
    //       </Form>
    //       <Form id={`form-${index}`} >

    //       {/* <Form id={`form-${index}`} onSubmit={handleSubmit}> */}
    //       <Form.Group controlId="quizOption">
    //         <Form.Check
    //           value="0"
    //           type="radio"
    //           aria-label="radio 1"
    //           label={questionsRadio[index].options[0]}
    //           onChange={handleChange}
    //           checked={questionResponse === "0"}
    //         />
    //         <Form.Check
    //           value="1"
    //           type="radio"
    //           aria-label="radio 2"
    //           label={questionsRadio[index].options[1]}
    //           onChange={handleChange}
    //           checked={questionResponse === "1"}
    //         />

    //       <Form.Check
    //           value="2"
    //           type="radio"
    //           aria-label="radio 2"
    //           label={questionsRadio[index].options[2]}
    //           onChange={handleChange}
    //           checked={questionResponse === "2"}
    //         />
    //         <Form.Check
    //           value="3"
    //           type="radio"
    //           aria-label="radio 2"
    //           label={questionsRadio[index].options[3]}
    //           onChange={handleChange}
    //           checked={questionResponse === "3"}
    //         />
    //       </Form.Group>
    //       <Button variant="primary" type="submit" disabled={state.creatingTransaction?true:false}>
    //         Submit
    //       </Button>
    //     </Form>
          
        
    //       </Col>
    //     </Row>
    //   </Container>;

    validateContent = 
    <Container fluid="sm" className="text-center">
    <Row>
      <Col>
        <Button  onClick={onValidateHolder} disabled={state.creatingTransaction}> Check Eligibility </Button>
      </Col>
    </Row>
    <br></br>
    <Row className={state.loggedIn!?"d-none text-center":"d-block text-center"}>
      <Col>
        <Button onClick={onSignUp} disabled={state.creatingTransaction} > Sign Up </Button>
      </Col>
    </Row>
    <br></br>

    <Row>
      <Col>
        <Button onClick={onQuickLogin} /*disabled={state.creatingTransaction}*/>{state.loggedIn!?"Log Out":"Log In"}</Button>
      </Col>
    </Row>
    </Container>;

      transactionContent = 
      
      <Container fluid="sm" className="text-center">
        <br></br>
        <Row>
          <Col>
            <ListGroup>
              {txns.map((type) => (
                <ListGroup.Item key={type} id={`default-${type}`}>
                  <a href={type} target="_blank"  rel="noreferrer">Transaction Sent</a>
                </ListGroup.Item>
            ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>;
  }

  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [isAuroInstalled, setIsAuroInstalled] = useState<boolean>(false);

  const [ETHAccount, setETHAccount] = useState<string | null>(null);
  const [MinaAccount, setMinaAccount] = useState<string | null>(null);

  let ETHWalletButton, MinaWalletButton;

  useEffect(() => {
    if((window as any).ethereum){
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
    }
  },[]);

  useEffect(() => {
    if((window as any).mina){
      //check if Metamask wallet is installed
      setIsAuroInstalled(true);
    }
  },[]);


  async function connectETHWallet(): Promise<void> {
    //to get around type checking
    (window as any).ethereum
      .request({
          method: "eth_requestAccounts",
      })
      .then((accounts : string[]) => {
        setETHAccount(accounts[0]);
      })
      .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
      });
  }

  async function connectMinaWallet(): Promise<void>{
    const mina = (window as any).mina;

    if (mina == null) {
      setState({ ...state, hasWallet: false });
      return;
    }

    const publicKeyBase58 : string = (await mina.requestAccounts())[0];
    const publicKey = PublicKey.fromBase58(publicKeyBase58);
    setMinaAccount(publicKeyBase58);
    const walletConnected = true;

    console.log('checking if account exists...');
    const res = await state.zkappWorkerClient?.fetchAccount({ publicKey: publicKey! });
    const accountExists = res?.error == null;

    setState({ 
      ...state, 
      publicKey: publicKey, 
      walletConnected: walletConnected,
      accountExists: accountExists
    });
  }

  async function onConnect(): Promise<void>{
    MinaAccount?connectETHWallet():connectMinaWallet();
  }

 

  ETHWalletButton = (ETHAccount === null)?
      <div className="text-center">
        {
          isMetamaskInstalled ? (
            <div>
              {/* <img src={logo} className="App-logo" alt="logo" /> */}
              <Button onClick={connectETHWallet}>Connect to Metamask</Button>
            </div>
          ) : (
            <p>Install Your Metamask wallet</p>
          )
        }
      </div>:
    <div className="text-center">
      <header className="App-header">
      <title>Proof of Ownership</title>
        {/* <img  className="App-logo" alt="logo" /> */}
        {/* <p>
          ETH wallet connected as: {ETHAccount}
        </p> */}
        <p>
          ETH wallet connected
        </p>
      </header>
    </div>

  MinaWalletButton = (MinaAccount === null)?
    <div className="text-center">
      {
        isAuroInstalled ? (
          <div>
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <Button onClick={connectMinaWallet}>Connect to Auro</Button>
          </div>
        ) : (
          <p>Install Your Auro wallet</p>
        )
      }
    </div>:
    <div className="text-center">
    <header className="App-header">
      {/* <img  className="App-logo" alt="logo" /> */}
      {/* <p>
        Mina wallet connected as: {MinaAccount}
      </p> */}
      <p>
        Mina wallet connected
      </p>
    </header>
    </div>


  let connectWalletMessage = 
  <Container fluid="sm" className="text-center">
    <Row>
      <Col>
      <h4>Connect Your Wallets to Sign Up/Log In</h4>
      </Col>
    </Row>
  </Container>

let walletNav = 
<ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
  <li className="nav-item">{ ETHWalletButton }</li>
  <li className="nav-item">{ MinaWalletButton }</li>
</ul>

let loginNav =
<ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
  <li className="nav-item">{ checkEligibilityButton }</li>
  <li className="nav-item">{ signUpButton }</li>
  <li className="nav-item">{ loginButton }</li>

</ul>

let navigation = 
<nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
    <Container>
        <a className="navbar-brand" href="#page-top"><img src="assets/img/navbar-logo.svg" alt="..." /></a>
        
        <div className="collapse navbar-collapse" id="navbarResponsive">
        {(MinaAccount && ETHAccount)?
          loginNav:
          walletNav
        }
        </div>
    </Container>
</nav>

let masterHead = 
  <header className="masthead">
      <Container >
          <div className="masthead-subheading">Welcome To Your Private Identity Portal!</div>
          <div className="masthead-heading text-uppercase">It's Nice To Meet You, Anon</div>
          <h4>(If your real name is Anon, we promise we had no clue)</h4>
          <br></br>
          <br></br>
          <br></br>
          <br></br>

          {(MinaAccount && ETHAccount && !state.loggedIn)?
          <h3>Sign Up or Log In to Access your Community</h3>:
          <Button onClick={onConnect} variant="light" size="lg" className={state.loggedIn?"d-none":"d-block"}>Connect to Metamask & Auro to Begin</Button>
          }
          {/* <p className="btn btn-primary btn-xl text-uppercase" href="#services">Tell Me More</a> */}
      </Container>
  </header>


  return <div>
    { navigation }
    { masterHead }
   {/* { logoContent } */}
   { setup }
   { accountDoesNotExist }
   
  
   {confettiContent}
   {loadingSpinner}

   { transactionContent }
  </div>
}
