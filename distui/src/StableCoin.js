import React, { Component } from "react";
import { useState } from 'react';
import { ethers } from 'ethers';
import ERC20USDStableCoin from './artifacts/StableCoins/ERC20USDStableCoin.sol/ERC20USDStableCoin.json';

class StableCoin extends Component {

    constructor(props) {
        super(props);
        this.message = 'Hello World';
        this.symbol = "pending";
        this.description = "pending";
        this.supply = "pending";
    }

    setDetail(symbol, description, supply) {
        this.symbol = symbol;
        this.description = description;
        this.supply = supply;
    }

    render() {
        return (
            <div>
                <p>Symbol: [{this.symbol}]</p>
                <p>Desr  : [{this.description}]</p>
                <p>Supply: [{this.supply}]</p>
            </div>
        );
    }
}

export default StableCoin;