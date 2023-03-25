import { useWeb3Contract } from "react-moralis";
import { USDCoin, EURCoin, CNYCoin, addressConfig } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";

export default function Contract(props) {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  let priceAddress = props.contract.address; // Price contract address passed as prop
  let contractType = props.contract.type;

  const [symbol, setTicker] = useState("?");
  const [decimals, setDecimals] = useState("0");
  const [token_name, setTokenName] = useState("?");
  const [token_supply, setTokenSupply] = useState("?");

  var contractABI = null;
  if (contractType === "usdStableCoin") {
    contractABI = USDCoin;
  }
  if (contractType === "eurStableCoin") {
    contractABI = EURCoin;
  }
  if (contractType === "cnyStableCoin") {
    contractABI = CNYCoin;
  }

  const dispatch = useNotification();

  const {
    runContractFunction: getSymbol,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "symbol",
    params: {},
  });

  const {
    runContractFunction: getTokenName,
  } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "name",
    params: {},
  });

  const { runContractFunction: getDecimals } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "decimals",
    params: {},
  });


  const { runContractFunction: getTokenSupply } = useWeb3Contract({
    abi: contractABI,
    contractAddress: priceAddress,
    functionName: "totalSupply",
    params: {},
  });

  async function updateUI() {
    const _decimals = Number((await getDecimals()));
    const _symbol = (await getSymbol());
    const _token_name = (await getTokenName());
    const _token_supply = Number(await getTokenSupply());
    setTicker(_symbol.toString());
    setDecimals(_decimals);
    setTokenName(_token_name);
    setTokenSupply(_token_supply / (10 **decimals));
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
      message: "Stable Token Received!",
      title: "Token Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="p-5">
      {priceAddress ? (
        <div>
          <div className="div-table">
            <div className="div-table-row">
              <div className="div-table-col-fix">Name</div>
              <div className="div-table-col">{token_name}</div>
            </div>
            <div className="div-table-row">
              <div className="div-table-col-fix">Symbol</div>
              <div className="div-table-col">{symbol}</div>
            </div>
            <div className="div-table-row">
              <div className="div-table-col-fix">Decimals</div>
              <div className="div-table-col">{decimals}</div>
            </div>
            <div className="div-table-row">
              <div className="div-table-col-fix">Supply</div>
              <div className="div-table-col">{token_supply}</div>
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
              getSymbol({
                onSuccess: handleSuccess,
              });
            }}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Update Supply</div>
            )}
          </button>
        </div>
      ) : (
        <div>Missing Token Contract Address</div>
      )}
    </div>
  );
}
