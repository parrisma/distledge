import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getERC721MintedOptionList } from "../lib/ERC721Util";
import MintedOption from "./MintedOption";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionList, setOptionList] = useState([]);

    async function update(buyerAccount) {
        if (isWeb3Enabled) {
            const res = JSON.parse(await getERC721MintedOptionList());
            if (res.hasOwnProperty('okCode')) {
                setOptionList(res.message.terms); // check for error B4 doing this
                console.log(JSON.stringify(optionList, null, 2));
            } else {
                console.log(`Failed to get OptionList from WebServer [${res.errorCode}]`);
            }
        } else {
            console.log(`OptionList: Not Web3 Connected`);
        }
    }

    useEffect(() => {
        update(props.buyerAccount);
    }, [isWeb3Enabled, props.buyerAccount]);

    return (
        <div>
            <div className="option-list">
                {optionList !== undefined && optionList.length > 0 ? (
                    <ul>{optionList.map((item) => <li><MintedOption optionId={item.optionId} /></li>)}</ul>
                ) : ``}
            </div>
        </div>
    );
};

export default Contract;
