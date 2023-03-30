import { useWeb3Contract } from "react-moralis";
import { EscrowStableCoinABI, addressConfig } from "../constants";

export function getEscrowContractABI(contractType) {
    var contractABI = null;
    if (contractType === "EscrowAccount") {
        contractABI = EscrowStableCoinABI;
    }
    return contractABI;
}

export function getManagedTokenNameC(addressOfDeployedEscrowAccount, contractABI, isLF) {
    const res = useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedEscrowAccount,
        functionName: "managedTokenName",
        params: {},
    });
    if (Boolean(isLF)) {
        return [res.runContractFunction, res.isFetching, res.isLoading];
    }
    return res.runContractFunction;
}

export function getBalanceOnHandC(addressOfDeployedLevel, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedLevel,
        functionName: "balanceOnHand",
        params: {},
    }).runContractFunction;
}

export function getIsBalancedC(addressOfDeployedLevel, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedLevel,
        functionName: "isBalanced",
        params: {},
    }).runContractFunction;
}