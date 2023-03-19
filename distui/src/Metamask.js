import React, { Component } from "react";
import { useState } from 'react';
import { ethers } from 'ethers';

class MetaMask extends Component {

    render() {
        const winType = typeof window.ethereum;
        if (winType !== "undefined") {
            return (
                <p>MetaMask <b>OK</b> and available in this Browser session</p>
            );
        }else{
            return (
                <p>MetaMask <b>not</b> started in this Browser session</p>
            );
        }
    }
}

export default MetaMask;
