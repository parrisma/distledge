import { useWeb3Contract } from "react-moralis";
import { addressConfig } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function EscrowManager(props) {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  let escrowManagerAddress = props.contract.address;

  const dispatch = useNotification();

  async function updateUI() {}

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
    <div className="p-4 border-b-2 flex flex-row">
      You can replace whatever you want here in the Escrow component.
    </div>
  );
}
