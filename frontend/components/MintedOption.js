import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionDetail, setOptionDetail] = useState({});

    async function update(optionId) {
        if (isWeb3Enabled) {
            if (true) {
                console.log(`OptionId [${optionId}]]`);
            } else {
                console.log(`Failed to get OptionList from WebServer [${res.errorCode}]`);
            }
        } else {
            console.log(`OptionList: Not Web3 Connected`);
        }
    }

    useEffect(() => {
        update(props.optionId);
    }, [isWeb3Enabled, props.buyerAccount]);

    return (
        <div>
            Option Id: {props.optionId}
        </div>
    );
};

export default Contract;
