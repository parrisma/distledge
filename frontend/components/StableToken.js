import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { getTokenContractABI, getSymbolC, getTokenNameC, getDecimalsC, getTokenSupplyC } from "../lib/StableTokenWrapper";

export default function Contract(props) {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const addressOfDeployedToken = props.contract.address; // Price contract address passed as prop
  const contractType = props.contract.type;

  const [symbol, setTicker] = useState("?");
  const [decimals, setDecimals] = useState("0");
  const [token_name, setTokenName] = useState("?");
  const [token_supply, setTokenSupply] = useState("?");

  const dispatch = useNotification();

  // Get ABI & Token Methods
  const contractABI = getTokenContractABI(contractType);
  const [getSymbol, isFetching, isLoading] = getSymbolC(addressOfDeployedToken, contractABI, true);
  const getTokenName = getTokenNameC(addressOfDeployedToken, contractABI);
  const getDecimals = getDecimalsC(addressOfDeployedToken, contractABI);
  const getTokenSupply = getTokenSupplyC(addressOfDeployedToken, contractABI)

  async function updateUI() {
    if (isWeb3Enabled) {
      const _decimals = Number((await getDecimals()));
      const _symbol = (await getSymbol());
      const _token_name = (await getTokenName());
      const _token_supply = Number(await getTokenSupply());
      setTicker(_symbol);
      setDecimals(_decimals);
      setTokenName(_token_name);
      setTokenSupply(_token_supply / (10 ** _decimals));
    }
  }

  useEffect(() => {
    updateUI(); // update immediately after render
    const interval = setInterval(() => { updateUI(); }, 2500);
    return () => {
      clearInterval(interval); // Stop update after unmounted
    };
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    handleButtonClick(`Request Token update ${tx}`);
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

  const handleButtonClick = (info) => {
    props.onAddInfo(info);
  };

  return (
    <div className="p-5">
      {addressOfDeployedToken ? (
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
            className="button"
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
