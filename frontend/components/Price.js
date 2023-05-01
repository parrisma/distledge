import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { getLevelContractABI, getTickerC, getLevelDetailsC, getVerifiedValueC, getDecimalsC } from "../lib/LevelWrapper";
import { ethers } from "ethers";

const Contract = (props) => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  let levelAddress = props.contract.address; // Price contract address passed as prop
  let contractType = props.contract.type;

  const [ticker, setTicker] = useState("?");
  const [verifiedValue, setVerifiedValue] = useState("0");
  const [decimals, setDecimals] = useState("0");
  const [description, setDescription] = useState("?");
  const dispatch = useNotification();

  const contractABI = getLevelContractABI(contractType);
  const [getTicker, isFetching, isLoading] = getTickerC(levelAddress, contractABI, true);
  const getLevelDetails = getLevelDetailsC(levelAddress, contractABI);
  const getVerifiedValue = getVerifiedValueC(levelAddress, contractABI);
  const getDecimals = getDecimalsC(levelAddress, contractABI);

  async function updateUI() {
    if (isWeb3Enabled) {
      const _decimals = Number(await getDecimals());
      const [_ticker, _description, _live, _value, _lastUpdate] = await getLevelDetails();
      setDescription(_description.toString());
      setTicker(_ticker.toString());
      setVerifiedValue(Number(_value) / 10 ** _decimals);
      setDecimals(_decimals);
    }
  }

  useEffect(() => {
    updateUI(); // update immediately after render
    const interval = setInterval(() => { updateUI(); }, 2000);
    return () => {
      clearInterval(interval); // Stop update after unmounted
    };
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    handleButtonClick(`Request price update ${tx}.`);
    handleNewNotification();
    //updateUI();
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

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(levelAddress, contractABI, provider);
    const handleChangeOfSource = async (
      currentSigner,
      newSigner,
      event
    ) => {
      let info =
        "Signer changed  from " +
        currentSigner +
        " to " +
        newSigner;
      props.onAddInfo(info);
    };
    const handleSecureLevelUpdate = async (
      value,
      event
    ) => {
      let info = "Secure level updated to " + value;
      props.onAddInfo(info);
    };
    const setSecureLevelEvents = async () => {
      // Subscribe to the "Deposit" event
      contract.on("ChangeOfSource", handleChangeOfSource, {
        fromBlock: 0,
        toBlock: "latest",
      });

      // Subscribe to the "Withdrawal" event
      contract.on("LevelUpdated", handleSecureLevelUpdate, {
        fromBlock: 0,
        toBlock: "latest",
      });
    };

    setSecureLevelEvents();

    return () => {
      contract.off("ChangeOfSource", handleChangeOfSource);
      contract.off("LevelUpdated", handleSecureLevelUpdate);
    };
  }, [levelAddress, contractABI]);

  return (
    <div className="p-5">
      {levelAddress ? (
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
            className="button"
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
        <div>Missing Level Contract Address</div>
      )}
    </div>
  );
};

export default Contract;
