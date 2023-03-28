import { useWeb3Contract } from "react-moralis";
import { equityPriceABI, FXPriceABI, addressConfig } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

const Contract = (props) => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  let priceAddress = props.contract.address; // Price contract address passed as prop
  let contractType = props.contract.type;

  const [ticker, setTicker] = useState("?");
  const [verifiedValue, setVerifiedValue] = useState("0");
  const [decimals, setDecimals] = useState("0");
  const [description, setDescription] = useState("?");

  var contractABI = null;
  if (contractType === "equity") {
    contractABI = equityPriceABI;
  }
  if (contractType === "fx") {
    contractABI = equityPriceABI;
  }

  const dispatch = useNotification();

  const {
    runContractFunction: getTicker,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "getTicker",
    params: {},
  });

  const { runContractFunction: getVerifiedValue } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "getVerifiedValue",
    params: {},
  });

  const { runContractFunction: getDetails } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "getDetails",
    params: {},
  });

  const { runContractFunction: getDecimals } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "getDecimals",
    params: {},
  });

  async function updateUI() {
    const _decimals = Number(await getDecimals());
    console.log({ _decimals });
    const [_ticker, _description, _live, _value, _lastUpdate] =
      await getDetails();
    setDescription(_description.toString());
    setTicker(_ticker.toString());
    setVerifiedValue(Number(_value) / 10 ** _decimals);
    setDecimals(_decimals);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    handleButtonClick("button has been clicked.");
    handleNewNotification();
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Ticker Received!",
      title: "Ticker Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const handleButtonClick = (info) => {
    props.onAddInfo(info);
  };

  return (
    <div className="p-5">
      {priceAddress ? (
        <div>
          <div className="div-table">
            <div className="div-table-row">
              <div className="div-table-col-fix">Description</div>
              <div className="div-table-col">{description}</div>
            </div>
            <div className="div-table-row">
              <div className="div-table-col-fix">Ticker</div>
              <div className="div-table-col">{ticker}</div>
            </div>
            <div className="div-table-row">
              <div className="div-table-col-fix">Price</div>
              <div className="div-table-col">{verifiedValue}</div>
            </div>
            <div className="div-table-row">
              <div className="div-table-col-fix">Decimals</div>
              <div className="div-table-col">{decimals}</div>
            </div>
            <div className="div-table-row">
              <div className="div-table-col-fix">Type</div>
              <div className="div-table-col">{contractType}</div>
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            disabled={isLoading || isFetching}
            onClick={() => {
              getTicker({
                onSuccess: handleSuccess,
              });
            }}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Update price</div>
            )}
          </button>
        </div>
      ) : (
        <div>Missing Price Contract Address</div>
      )}
    </div>
  );
};

export default Contract;
