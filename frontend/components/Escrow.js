import { useWeb3Contract } from "react-moralis";
import { EscrowStableCoinABI, addressConfig } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";

export default function Contract(props) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    let escrowAddress = props.contract.address; // Price contract address passed as prop
    let contractType = props.contract.type;

    const [managed_token_name, setManagedTokenName] = useState("?");
    const [balance_on_hand, setBalanceOnHand] = useState("0");
    const [isBalanced, setIsBalanced] = useState("?");

    var contractABI = null;
    if (contractType === "EscrowAccount") {
        contractABI = EscrowStableCoinABI;
    } else {
        console.log(`Unknown contract Type ${contractType}`);
    }

    const dispatch = useNotification();

    const {
        runContractFunction: getManagedTokenName,
        isLoading,
        isFetching,
        error
    } = useWeb3Contract({
        abi: contractABI,
        contractAddress: escrowAddress,
        functionName: "managedTokenName",
        params: {},
    });

    const {
        runContractFunction: getBalanceOnHand,
    } = useWeb3Contract({
        abi: contractABI,
        contractAddress: escrowAddress,
        functionName: "balanceOnHand",
        params: {},
    });

    const {
        runContractFunction: getIsBalanced,
    } = useWeb3Contract({
        abi: contractABI,
        contractAddress: escrowAddress,
        functionName: "isBalanced",
        params: {},
    });

    async function updateUI() {
        const _managed_token_name = (await getManagedTokenName());
        const _balance_on_hand = Number(await getBalanceOnHand());
        const _isBalanced = Boolean(await getIsBalanced());
        setManagedTokenName(_managed_token_name);
        setBalanceOnHand(_balance_on_hand);
        setIsBalanced(_isBalanced.toString());
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx) => {
        handleButtonClick(`Request Escrow update ${tx}`);
        handleNewNotification();
        updateUI();
    };

    const handleError = async (err) => {
        console.log(error);
    };

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Escrow Account Received!",
            title: "Escrow Notification",
            position: "topR",
            icon: "bell",
        });
    };

    const handleButtonClick = (info) => {
        props.onAddInfo(info);
    };

    return (
        <div className="p-5">
            {escrowAddress ? (
                <div>
                    <div className="div-table">
                        <div className="div-table-row">
                            <div className="div-table-col-fix">Escrow For</div>
                            <div className="div-table-col">{managed_token_name}</div>
                        </div>
                        <div className="div-table-row">
                            <div className="div-table-col-fix">Supply</div>
                            <div className="div-table-col">{balance_on_hand}</div>
                        </div>
                        <div className="div-table-row">
                            <div className="div-table-col-fix">Balanced</div>
                            <div className="div-table-col">{isBalanced}</div>
                        </div>
                    </div>
                    <button
                        className="button"
                        disabled={isLoading || isFetching}
                        onClick={() => {
                            getManagedTokenName({
                                onSuccess: handleSuccess,
                                onError: handleError,
                            });
                        }}
                    >
                        {isLoading || isFetching ? (
                            <div className="button"></div>
                        ) : (
                            <div>Update</div>
                        )}
                    </button>
                </div>
            ) : (
                <div>Missing Escrow Contract Address</div>
            )}
        </div>
    );
}
