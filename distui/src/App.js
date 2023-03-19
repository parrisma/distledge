import { useState } from 'react';
import { ethers } from 'ethers';
import StableCoin from './StableCoin';
import MetaMask from './Metamask';
import './App.css';
import ERC20USDStableCoin from './artifacts/StableCoins/ERC20USDStableCoin.sol/ERC20USDStableCoin.json';
import EquityPrice from './artifacts/DataFeeder/EquityPrice.sol/EquityPrice.json';


async function getTokenDetail() {
  // If MetaMask is running in ths browser session
  if (typeof window.ethereum !== "undefined") {
    const addr = "0x663F3ad617193148711d28f5334eE4Ed07016602";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(); // Metamask only exposes a single signer account at a time
    var equityPrice = new ethers.Contract(
      addr,
      EquityPrice.abi,
      signer
    );
    console.log(await equityPrice.getDetails());
  }
}

function App() {
  // Inspect and look at Consol to see details onClick
  return (
    <div className="App">
      <div className="App-header">
        <h3>On Chain Contracts</h3>
        <MetaMask />
        <button onClick={getTokenDetail}> 
          Get Equity Detail
        </button>
      </div>
    </div>
  );
}

export default App;
