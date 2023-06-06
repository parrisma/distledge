import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../constants";
import { getTokenContractABI, getBalanceOfC, getDecimalsC } from "../lib/StableTokenWrapper";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();

    const [usdTokenBalance, setUsdTokenBalance] = useState("0");
    const [eurTokenBalance, setEurTokenBalance] = useState("0");
    const [cnyTokenBalance, setCnyTokenBalance] = useState("0");
    
    const [usdCashBalance, setUsdCashBalance] = useState("0");
    const [eurCashBalance, setEurCashBalance] = useState("0");
    const [cnyCashBalance, setCnyCashBalance] = useState("0");

    const coinTokenABI = getTokenContractABI("usdStableCoin");
    const getEURTokenBalanceOfAccount = getBalanceOfC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getUSDTokenBalanceOfAccount = getBalanceOfC(addressConfig.usdStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getCNYTokenBalanceOfAccount = getBalanceOfC(addressConfig.cnyStableCoin, coinTokenABI, props.accountDetail.accountAddress);

    const getEURTokenDecimalsOfAccount = getDecimalsC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getUSDTokenDecimalsOfAccount = getDecimalsC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getCNYTokenDecimalsOfAccount = getDecimalsC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);

    async function updateAllTokenBalances() {
        if (isWeb3Enabled) {
            const _usdTokenBalance = Number(await getUSDTokenBalanceOfAccount());
            const _eurTokenBalance = Number(await getEURTokenBalanceOfAccount());
            const _cnyTokenBalance = Number(await getCNYTokenBalanceOfAccount());
            const _usdTokenDecimal = Number(await getUSDTokenDecimalsOfAccount());
            const _eurTokenDecimal = Number(await getEURTokenDecimalsOfAccount());
            const _cnyTokenDecimal = Number(await getCNYTokenDecimalsOfAccount());
            
            setUsdTokenBalance(_usdTokenBalance / 10 ** _usdTokenDecimal);
            setEurTokenBalance(_eurTokenBalance / 10 ** _eurTokenDecimal);
            setCnyTokenBalance(_cnyTokenBalance / 10 ** _cnyTokenDecimal);

            setUsdCashBalance(props.accountDetail.usd / 10 ** _usdTokenDecimal);
            setEurCashBalance(props.accountDetail.eur / 10 ** _eurTokenDecimal);
            setCnyCashBalance(props.accountDetail.cny / 10 ** _cnyTokenDecimal);
        }
    }

    // Update every 2.5 seconds.
    useEffect(() => {
        console.log(`isWeb3Enabled : [${isWeb3Enabled}]`);
        updateAllTokenBalances(); // update immediately after render
        const interval = setInterval(() => { updateAllTokenBalances(); }, 2500);
        return () => {
            clearInterval(interval); // Stop update after unmounted
        };
    }, [isWeb3Enabled]);

    return (
        <div>
            <div className="div-table">
                {props.withHeader ? (
                    <div className="div-table-row">
                        <div className="div-table-col-fix-lab">
                            &nbsp;
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
                                updateAllTokenBalances();
                            }}
                        >
                            Update
                        </button>
                    </div>
                    <div className="div-table-col-fix-lab">
                        {props.accountDetail.accountName}
                    </div>
                    <div className="div-table-col-fix-address-data">
                        {props.accountDetail.accountAddress}
                    </div>
                    <div className="div-table-col-fix-number">
                        {eurCashBalance}
                    </div>
                    <div className="div-table-col-fix-number">
                        {eurTokenBalance}
                    </div>
                    <div className="div-table-col-fix-number">
                        {usdCashBalance}
                    </div>
                    <div className="div-table-col-fix-number">
                        {usdTokenBalance}
                    </div>
                    <div className="div-table-col-fix-number">
                        {cnyCashBalance}
                    </div>
                    <div className="div-table-col-fix-number">
                        {cnyTokenBalance}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;