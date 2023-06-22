import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { addressConfig } from "../constants";
import { getTokenContractABI, getBalanceOfC, getDecimalsC } from "../lib/StableTokenWrapper";
import { StableCoinType, StableShareType } from "../constants";
import { Button } from "@material-ui/core";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();

    const [usdTokenBalance, setUsdTokenBalance] = useState("0");
    const [eurTokenBalance, setEurTokenBalance] = useState("0");
    const [cnyTokenBalance, setCnyTokenBalance] = useState("0");
    const [appleTokenBalance, setAppleTokenBalance] = useState("0");
    const [teslaTokenBalance, setTeslaTokenBalance] = useState("0");

    const [usdCashBalance, setUsdCashBalance] = useState("0");
    const [eurCashBalance, setEurCashBalance] = useState("0");
    const [cnyCashBalance, setCnyCashBalance] = useState("0");

    const coinTokenABI = getTokenContractABI(StableCoinType);
    const getEURTokenBalanceOfAccount = getBalanceOfC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getUSDTokenBalanceOfAccount = getBalanceOfC(addressConfig.usdStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getCNYTokenBalanceOfAccount = getBalanceOfC(addressConfig.cnyStableCoin, coinTokenABI, props.accountDetail.accountAddress);

    const getEURTokenDecimalsOfAccount = getDecimalsC(addressConfig.eurStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getUSDTokenDecimalsOfAccount = getDecimalsC(addressConfig.usdStableCoin, coinTokenABI, props.accountDetail.accountAddress);
    const getCNYTokenDecimalsOfAccount = getDecimalsC(addressConfig.cnyStableCoin, coinTokenABI, props.accountDetail.accountAddress);

    const shareTokenABI = getTokenContractABI(StableShareType);
    const getAppleTokenBalanceOfAccount = getBalanceOfC(addressConfig.appleStableShare, shareTokenABI, props.accountDetail.accountAddress);
    const getTeslaTokenBalanceOfAccount = getBalanceOfC(addressConfig.teslaStableShare, shareTokenABI, props.accountDetail.accountAddress);

    const getAppleTokenDecimalsOfAccount = getDecimalsC(addressConfig.appleStableShare, shareTokenABI, props.accountDetail.accountAddress);
    const getTeslaTokenDecimalsOfAccount = getDecimalsC(addressConfig.teslaStableShare, shareTokenABI, props.accountDetail.accountAddress);


    async function updateAllTokenBalances() {
        if (isWeb3Enabled) {
            const _usdTokenBalance = Number(await getUSDTokenBalanceOfAccount());
            const _eurTokenBalance = Number(await getEURTokenBalanceOfAccount());
            const _cnyTokenBalance = Number(await getCNYTokenBalanceOfAccount());
            const _usdTokenDecimal = Number(await getUSDTokenDecimalsOfAccount());
            const _eurTokenDecimal = Number(await getEURTokenDecimalsOfAccount());
            const _cnyTokenDecimal = Number(await getCNYTokenDecimalsOfAccount());
            const _appleTokenBalance = Number(await getAppleTokenBalanceOfAccount());
            const _teslaTokenBalance = Number(await getTeslaTokenBalanceOfAccount());
            const _appleTokenDecimals = Number(await getAppleTokenDecimalsOfAccount());
            const _teslaTokenDecimals = Number(await getTeslaTokenDecimalsOfAccount());

            setUsdTokenBalance(_usdTokenBalance / (10 ** _usdTokenDecimal));
            setEurTokenBalance(_eurTokenBalance / (10 ** _eurTokenDecimal));
            setCnyTokenBalance(_cnyTokenBalance / (10 ** _cnyTokenDecimal));
            setAppleTokenBalance(_appleTokenBalance / (10 ** _appleTokenDecimals));
            setTeslaTokenBalance(_teslaTokenBalance / (10 ** _teslaTokenDecimals));

            setUsdCashBalance(props.accountDetail.usd);
            setEurCashBalance(props.accountDetail.eur);
            setCnyCashBalance(props.accountDetail.cny);
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
                    <div className="div-table-row-header">
                        <div className="div-table-col-fix-lab">
                            &nbsp;
                        </div>
                        <div className="div-table-col-fix-lab">
                            Name:
                        </div>
                        <div className="div-table-col-fix-address">
                            Wallet Address:
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
                        <div className="div-table-col-fix-lab">
                            Apple Token
                        </div>
                        <div className="div-table-col-fix-lab">
                            Tesla Token
                        </div>
                    </div>
                ) : null}
                <div className="div-table-row">
                    <div className="div-table-col-fix-lab">
                        <Button color="primary" variant="contained"
                            onClick={() => {
                                updateAllTokenBalances();
                            }}
                        >
                            Update
                        </Button>
                    </div>
                    <div className="div-table-col-fix-lab">
                        {props.displayName}
                    </div>
                    <div className="div-table-col-fix-address-data">
                        {props.accountDetail.accountAddress}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {eurCashBalance}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {eurTokenBalance}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {usdCashBalance}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {usdTokenBalance}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {cnyCashBalance}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {cnyTokenBalance}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {appleTokenBalance}
                    </div>
                    <div className="div-table-col-fix-lab">
                        {teslaTokenBalance}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;