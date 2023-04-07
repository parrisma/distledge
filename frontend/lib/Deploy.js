import { useMoralis } from "react-moralis";

export function getWeb3Provider() {
    const { isWeb3Enabled, Moralis } = useMoralis();
    const web = new Web3(Moralis.provider);
}
