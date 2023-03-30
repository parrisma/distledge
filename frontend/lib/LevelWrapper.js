import { useWeb3Contract } from "react-moralis";
import { equityPriceABI, FXPriceABI } from "../constants";

export function getLevelContractABI(contractType) {
    var contractABI = null;
    if (contractType === "equity") {
        contractABI = equityPriceABI;
    }
    else if (contractType === "fx") {
        contractABI = FXPriceABI;
    }
    return contractABI;
}

export function getTickerC(addressOfDeployedLevel, contractABI, isLF) {
    const res = useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedLevel,
        functionName: "getTicker",
        params: {},
    });
    if (Boolean(isLF)) {
        return [res.runContractFunction, res.isFetching, res.isLoading];
    }
    return res.runContractFunction;
}

export function getVerifiedValueC(addressOfDeployedLevel, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedLevel,
        functionName: "getVerifiedValue",
        params: {},
    }).runContractFunction;
}

export function getLevelDetailsC(addressOfDeployedLevel, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedLevel,
        functionName: "getDetails",
        params: {},
    }).runContractFunction;
}

export function getDecimalsC(addressOfDeployedLevel, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedLevel,
        functionName: "getDecimals",
        params: {},
    }).runContractFunction;
}