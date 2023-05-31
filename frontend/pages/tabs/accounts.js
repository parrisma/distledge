import React, { Component } from "react";
import { addressConfig } from "../../constants";
import Account from "../../components/Account";

const Contract = (props) => {

    return (
        <div>
            <Account accountDetail={addressConfig.escrowAccount} withHeader={true} />
            <Account accountDetail={addressConfig.tokenAccount} withHeader={false} />
            <Account accountDetail={addressConfig.dataAccount} withHeader={false} />
            <Account accountDetail={addressConfig.sellerAccount} withHeader={false} />
            <Account accountDetail={addressConfig.buyerAccount} withHeader={false} />
        </div>
    );
};

export default Contract;
