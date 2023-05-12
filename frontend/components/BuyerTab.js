import { addressConfig } from "../constants";
import { getWeb3Accounts } from "@/lib/AccountUtil";
import { useState, useEffect } from "react";

const Contract = (props) => {

    [acct, setAcct] = useState("?");

    const web3Acct = getWeb3Accounts();

    useEffect(() => {
        
        return () => {
            console.log(`Unmount`)
        };
    }, [web3Acct]);


    return (
        <div>
            <p>Buyer</p>
        </div>
    );
};

export default Contract;
