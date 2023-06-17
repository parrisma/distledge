import React, { Component } from "react";
import { addressConfig } from "../../constants";
import Account from "../../components/Account";

const Contract = (props) => {

    return (
        <div>
            <Account accountDetail={addressConfig.escrowAccount} displayName={`Control Account`} withHeader={true} />
            <Account accountDetail={addressConfig.dataAccount} displayName={`Data Provider`} withHeader={false} />
            <Account accountDetail={addressConfig.sellerAccount} displayName={`Option Issuer`} withHeader={false} />
            <Account accountDetail={addressConfig.buyerAccount} displayName={`Option Buyer 1`} withHeader={false} />
            <Account accountDetail={addressConfig.buyer2Account} displayName={`Option Buyer 2`} withHeader={false} />
            <Account accountDetail={addressConfig.buyer3Account} displayName={`Option Buyer 3`} withHeader={false} />
        </div>
    );
};

export default Contract;
