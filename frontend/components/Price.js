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
  const [decimals, setDecimals] = useState(0);
  const [description, setDescription] = useState("?");
  const dispatch = useNotification();
  const [decimalsForCalc, setDecimalsForCalc] = useState([]);
  const [symbolForCalc, setSymbolForCalc] = useState([]);

  const contractABI = getLevelContractABI(contractType);
  const [getTicker, isFetching, isLoading] = getTickerC(levelAddress, contractABI, true);
  const getLevelDetails = getLevelDetailsC(levelAddress, contractABI);
  const getVerifiedValue = getVerifiedValueC(levelAddress, contractABI);
  const getDecimalsFromContract = getDecimalsC(levelAddress, contractABI);

  const [priceCellClass, setPriceCellClass] = useState("div-table-col");

  function formatValue(value, decimals) {
    return Number(value) / 10 ** decimals
  }

  async function updateUI() {
    if (isWeb3Enabled) {
      const _decimals = Number(await getDecimalsFromContract());
      const [_ticker, _description, _live, _value, _lastUpdate] = await getLevelDetails();
      setDescription(_description.toString());
      setTicker(_ticker.toString());
      updateUpdatePriceCell(formatValue(_value, _decimals));
      setDecimals(_decimals);
      decimalsForCalc.push(_decimals);
      setDecimalsForCalc(decimalsForCalc);
      symbolForCalc.push(_ticker);
      setSymbolForCalc(symbolForCalc);
    }
  }

  function updateUpdatePriceCell(formattedValue) {
    setVerifiedValue(prevValue => {
      if (formattedValue > prevValue) {
        setPriceCellClass(prevPriceCellClass => "div-table-col price-up");
      } else if (formattedValue < prevValue) {
        setPriceCellClass(prevPriceCellClass => "div-table-col price-down");
      } else {
        setPriceCellClass(prevPriceCellClass => "div-table-col");
      }
      return formattedValue;
    });
  }

  useEffect(() => {
    updateUI(); // update immediately once page is mounted.
  }, []);

  const handleSuccess = async (tx) => {
    handleButtonClick(`Request price update ${tx}.`);
    handleNewNotification();
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
      let valueFormatted = formatValue(value, decimalsForCalc[0]);
      updateUpdatePriceCell(valueFormatted);
      let info = `Secure ${symbolForCalc[0]} level updated to ${valueFormatted}`;
      setVerifiedValue(valueFormatted);
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
              <div className={priceCellClass}>{verifiedValue}</div>
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
        </div>
      ) : (
        <div>Missing Level Contract Address</div>
      )}
    </div>
  );
};

export default Contract;
