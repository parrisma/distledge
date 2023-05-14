import SimpleOption from "../components/SimpleOption";
import Warning from "../components/Warning";
import { getConnectAccount } from "../lib/AccountUtil";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../constants";

const Contract = (props) => {

    const { isWeb3Enabled, user, Moralis } = useMoralis();
    const sellerAccount = addressConfig.sellerAccount.accountAddress.toString().toUpperCase();

    return (
        <div>
            <p>Seller Account: [{sellerAccount}]</p>
            {"" != null ? (
                <SimpleOption />
            ) : (
                <Warning
                    message={"Install and/or connect to virtual wallet e.g. MetaMask"}
                />
            )}
        </div>
    );
};

export default Contract;
