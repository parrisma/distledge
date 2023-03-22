import { useWeb3Contract } from "react-moralis";
import { equityPriceABI, addressConfig } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function Contract() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const equityPriceAddress = addressConfig["teslaEquityPriceContract"]
    ? addressConfig["teslaEquityPriceContract"]
    : null;
  const [ticker, setTicker] = useState("0");
  const [verifiedValue, setVerifiedValue] = useState("0");

  const dispatch = useNotification();

  const {
    runContractFunction: getTicker,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: equityPriceABI,
    contractAddress: equityPriceAddress,
    functionName: "getTicker",
    params: {},
  });

  const { runContractFunction: getVerifiedValue } = useWeb3Contract({
    abi: equityPriceABI,
    contractAddress: equityPriceAddress,
    functionName: "getVerifiedValue",
    params: {},
  });

  async function updateUI() {
    const getTickerFromCall = (await getTicker()).toString();
    const getVerifiedValueFromCall = (await getVerifiedValue()).toString();
    setTicker(getTickerFromCall);
    setVerifiedValue(getVerifiedValueFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
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
  return (
    <div className="p-5">
      Hi from Contract entrance!
      {equityPriceAddress ? (
        <div>
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
              <div>See Underlying price</div>
            )}
          </button>
          <div>
            Ticker: {ticker} Price:{verifiedValue} USD
          </div>
          <div>End</div>
        </div>
      ) : (
        <div>No Equity Address Detected</div>
      )}
    </div>
  );
}
