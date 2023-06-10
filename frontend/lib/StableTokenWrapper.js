import { useWeb3Contract } from "react-moralis";
import { StableCoinType, StableShareType, ERC20StableAsset } from "../constants";

export function getTokenContractABI(contractType) {
    var contractABI = undefined;
    if (contractType === `${StableCoinType}`) {
        contractABI = ERC20StableAsset;
    }
    else if (contractType === `${StableShareType}`) {
        contractABI = ERC20StableAsset;
    }
    return contractABI;
}

export function getSymbolC(addressOfDeployedToken, contractABI, isLF) {
    const res = useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedToken,
        functionName: "symbol",
        params: {},
    });
    if (Boolean(isLF)) {
        return [res.runContractFunction, res.isFetching, res.isLoading];
    }
    return res.runContractFunction;
}

export function getTokenNameC(addressOfDeployedToken, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedToken,
        functionName: "name",
        params: {},
    }).runContractFunction;
}

export function getDecimalsC(addressOfDeployedToken, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedToken,
        functionName: "decimals",
        params: {},
    }).runContractFunction;
}

export function getTokenSupplyC(addressOfDeployedToken, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedToken,
        functionName: "totalSupply",
        params: {},
    }).runContractFunction;
}

export function getISOCcyCodeC(addressOfDeployedToken, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedToken,
        functionName: "isoCcyCode",
        params: {},
    }).runContractFunction;
}

export function getUnitsPerTokenC(addressOfDeployedToken, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedToken,
        functionName: "unitsPerToken",
        params: {},
    }).runContractFunction;
}

export function getBalanceOfC(addressOfDeployedToken,
    contractABI,
    accountAddressToGetBalanceOf) {
    const addr = accountAddressToGetBalanceOf.toString();
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedToken,
        functionName: "balanceOf",
        params: {
            account: addr
        },
    }).runContractFunction;
}
