import { useState } from 'react';
import { ethers } from 'ethers';
import EquityPriceComp from './components/DataFeeder/EquityPrice';
import MetaMask from './Metamask';
import './App.css';

function App() {
  // Inspect and look at Consol to see details onClick
  return (
    <div className="App">
      <div className="App-header">
        <h3>On Chain Contracts</h3>
        <MetaMask />
        <EquityPriceComp />
      </div>
    </div>
  );
}

export default App;
