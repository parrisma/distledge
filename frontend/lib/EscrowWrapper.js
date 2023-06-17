import { useWeb3Contract } from "react-moralis";
import { EscrowAccountABI } from "../constants";

export function getEscrowContractABI(contractType) {
    var contractABI = null;
    if (contractType === "EscrowAccount") {
        contractABI = EscrowAccountABI;
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

export function getBalanceOnHandC(addressOfDeployedEscrowAccount, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedEscrowAccount,
        functionName: "balanceOnHand",
        params: {},
    }).runContractFunction;
}

export function getIsBalancedC(addressOfDeployedEscrowAccount, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedEscrowAccount,
        functionName: "isBalanced",
        params: {},
    }).runContractFunction;
}

export function getEscrowDecimalsC(addressOfDeployedEscrowAccount, contractABI) {
    return useWeb3Contract({
        abi: contractABI,
        contractAddress: addressOfDeployedEscrowAccount,
        functionName: "decimals",
        params: {},
    }).runContractFunction;

}