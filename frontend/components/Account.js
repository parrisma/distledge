import { useState } from "react";
import { addressConfig } from "../constants";
import { getTokenContractABI, getBalanceOfC } from "../lib/StableTokenWrapper";

const Contract = (props) => {

    const [usdTokenBalence, setUsdTokenBalance] = useState("0");
    const [eurTokenBalence, setEurTokenBalance] = useState("0");
    const [cnyTokenBalence, setCnyTokenBalance] = useState("0");

    const coinTokenABI = getTokenContractABI("usdStableCoin");
    const getEURTokenBalanceOfAccount = getBalanceOfC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getUSDTokenBalanceOfAccount = getBalanceOfC(addressConfig.usdStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getCNYTokenBalanceOfAccount = getBalanceOfC(addressConfig.cnyStableCoin, coinTokenABI, props.accountDetail.accountAddress);

    async function updateAllTokenBalences() {
        const _usdTokenBalence = Number(await getUSDTokenBalanceOfAccount());
        const _eurTokenBalence = Number(await getEURTokenBalanceOfAccount());
        const _cnyTokenBalence = Number(await getCNYTokenBalanceOfAccount());
        setUsdTokenBalance(_usdTokenBalence);
        setEurTokenBalance(_eurTokenBalence);
        setCnyTokenBalance(_cnyTokenBalence);
    }

    return (
        <div>
            <div className="div-table">
                {props.withHeader ? (
                    <div className="div-table-row">
                        <div className="div-table-col-fix-lab">
                            Update
                        </div>
                        <div className="div-table-col-fix-lab">
                            Name:
                        </div>
                        <div className="div-table-col-fix-address">
                            Address:
                        </div>
                        <div className="div-table-col-fix-lab">
                            EUR Cash:
                        </div>
                        <div className="div-table-col-fix-lab">
                            EUR Token
                        </div>
                        <div className="div-table-col-fix-lab">
                            USD Cash:
                        </div>
                        <div className="div-table-col-fix-lab">
                            USD Token
                        </div>
                        <div className="div-table-col-fix-lab">
                            CNY Cash:
                        </div>
                        <div className="div-table-col-fix-lab">
                            CNY Token
                        </div>
                    </div>
                ) : null}
                <div className="div-table-row">
                    <div className="div-table-col-fix-lab">
                        <button
                            className="button"
                            onClick={() => {
                                updateAllTokenBalences();
                            }}
                        >
                            Go
                        </button>
                    </div>
                    <div className="div-table-col-fix-lab">
                        {props.accountDetail.accountName}
                    </div>
                    <div className="div-table-col-fix-address-data">
                        {props.accountDetail.accountAddress}
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.accountDetail.eur}
                    </div>
                    <div className="div-table-col-fix-number">
                        {eurTokenBalence}
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.accountDetail.usd}
                    </div>
                    <div className="div-table-col-fix-number">
                        {usdTokenBalence}
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.accountDetail.cny}
                    </div>
                    <div className="div-table-col-fix-number">
                        {cnyTokenBalence}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;