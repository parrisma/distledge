import React, { Component } from "react";
import { useState } from 'react';
import { ethers } from 'ethers';
import EquityPriceContract from '../../artifacts/DataFeeder/EquityPrice.sol/EquityPrice.json';

/**
 * Manage an Equity Price Contract
 */
class EquityPrice extends Component {

    constructor(props) {
        super(props);

        this.state = {
            symbol: null,
            description: null,
            value: null
        };
        this.equityPrice = null;
        this.signer = null;
        this.addr = "0x663F3ad617193148711d28f5334eE4Ed07016602";
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    /**
     * Load the Equity Price contract for the given address & extract the basic
     * details and set into the component state.
     */
    loadEquity() {
        if (this.signer == null) { // Get Signer
            (async () => {
                await this.provider.send("eth_requestAccounts", []);
            })();
        }
        this.signer = this.provider.getSigner()
        this.equityPrice = new ethers.Contract(
            this.addr,
            EquityPriceContract.abi,
            this.signer
        );
        this.updateEquity();
    }

    updateEquity() {
        (async () => {
            if (this.equityPrice != null) { // Can only get details if Equity Contract has been loaded.
                const [_ticker, _description, _live, _value, _lastUpdate] = await this.equityPrice.getDetails();
                this.setState({ symbol: String(_ticker), description: String(_description), value: String(Number(_value)) });
            } else {
                this.setState({ symbol: 'N/A', description: 'Equity Not Loaded', value: 'NA' });
            }
        })();
    }

    render() {
        if (this.state.symbol != null) {
            return (
                <div>
                    <p>Equity Ticker : [{this.state.symbol}]</p>
                    <p>Equity Description : [{this.state.description}]</p>
                    <p>Equity Value : [{this.state.value}]</p>
                    <button onClick={() => this.updateEquity()}>Update Equity Details</button>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Click to Load Equity : [{this.addr}]</p>
                    <button onClick={() => this.loadEquity()}>Load Equity Contract</button>
                </div>
            );
        }
    }
}

export default EquityPrice;