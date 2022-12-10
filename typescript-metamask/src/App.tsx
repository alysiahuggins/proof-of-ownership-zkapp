import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";


const App: React.FC = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
 
 useEffect(() => {
    if((window as any).ethereum){
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
    }
  },[]);

  async function connectWallet(): Promise<void> {
    //to get around type checking
    (window as any).ethereum
      .request({
          method: "eth_requestAccounts",
      })
      .then((accounts : string[]) => {
          setAccount(accounts[0]);
      })
      .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
      });
  }

  if (account === null) {
    return (
      <div className="App App-header">
        {
          isMetamaskInstalled ? (
            <div>
              <img src={logo} className="App-logo" alt="logo" />
              <button onClick={connectWallet}>Connect Your Metamask Wallet</button>
            </div>
          ) : (
            <p>Install Your Metamask wallet</p>
          )
        }
  
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          ETH wallet connected as: {account}
        </p>
      </header>
    </div>
  );
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
