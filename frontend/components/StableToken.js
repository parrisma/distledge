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
    <div>
      <div>
        <div className="div-table">
          {props.withHeader ? (
            <div className="div-table-row-header">
              <div className="div-table-col-fix-mid">Name</div>
              <div className="div-table-col-fix">Symbol</div>
              <div className="div-table-col-fix">Decimals</div>
              <div className="div-table-col-fix">Supply</div>
              <div className="div-table-col-fix">Type</div>
              <div className="div-table-col-fix"><div /></div>
            </div>
          ) : null}
          <div className="div-table-row">
            <div className="div-table-col-fix-mid">{token_name}</div>
            <div className="div-table-col-fix">{symbol}</div>
            <div className="div-table-col-fix">{decimals}</div>
            <div className="div-table-col-fix">{token_supply}</div>
            <div className="div-table-col-fix">{contractType}</div>
            <div className="div-table-col-fix">
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
              <div>Update Supply</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
