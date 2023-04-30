import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { getEscrowContractABI, getManagedTokenNameC, getBalanceOnHandC, getIsBalancedC } from "@/lib/EscrowWrapper";
import { ethers } from "ethers";

export default function Contract(props) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    let escrowAddress = props.contract.address; // Price contract address passed as prop
    let contractType = props.contract.type;

    const [managed_token_name, setManagedTokenName] = useState("?");
    const [balance_on_hand, setBalanceOnHand] = useState("0");
    const [isBalanced, setIsBalanced] = useState("?");
    const dispatch = useNotification();

    const contractABI = getEscrowContractABI(contractType);
    const [getManagedTokenName, isFetching, isLoading] = getManagedTokenNameC(escrowAddress, contractABI, true);
    const getBalanceOnHand = getBalanceOnHandC(escrowAddress, contractABI);
    const getIsBalanced = getIsBalancedC(escrowAddress, contractABI);

    async function updateUI() {
        if (isWeb3Enabled) {
            const _managed_token_name = (await getManagedTokenName());
            const _balance_on_hand = Number(await getBalanceOnHand());
            const _isBalanced = Boolean(await getIsBalanced());
            setManagedTokenName(_managed_token_name);
            setBalanceOnHand(_balance_on_hand);
            setIsBalanced(_isBalanced.toString());
        }
    }

    useEffect(() => {
        updateUI(); // update immediatly after render
        const interval = setInterval(() => { if (isWeb3Enabled) { updateUI(); } }, 2500);
        return () => {
            clearInterval(interval); // Stop update after unmounted
        };
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx) => {
        handleButtonClick(`Request Escrow update ${tx}`);
        handleNewNotification();
        updateUI();
    };

    const handleError = async (err) => {
        console.log(err);
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

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(escrowAddress, contractABI, provider);
    const handleDeposit = async (
      assetCode,
      from,
      quantity,
      transactionId,
      balance,
      event
    ) => {
      let info =
        quantity +
        " " +
        assetCode +
        " deposited from " +
        from +
        ", balance " +
        balance;
      props.onAddInfo(info);
    };
    const handleWithdrawal = async (
      assetCode,
      to,
      quantity,
      transactionId,
      balance,
      event
    ) => {
      let info =
        quantity +
        " " +
        assetCode +
        " withdrawn to " +
        to +
        ", balance " +
        balance;
      props.onAddInfo(info);
    };
    const setEscrowEvents = async () => {
      // Subscribe to the "Deposit" event
      contract.on("Deposit", handleDeposit, {
        fromBlock: 0,
        toBlock: "latest",
      });

      // Subscribe to the "Withdrawal" event
      contract.on("Withdrawal", handleWithdrawal, {
        fromBlock: 0,
        toBlock: "latest",
      });
    };

    setEscrowEvents();

    return () => {
      contract.off("Deposit", handleDeposit);
      contract.off("Withdrawal", handleWithdrawal);
    };
  }, [escrowAddress, contractABI]);

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
