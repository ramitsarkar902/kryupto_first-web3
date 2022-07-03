import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { ContractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const contract = new ethers.Contract(
    contractAddress,
    ContractABI,
    provider.getSigner()
  );

  return contract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount") || 0
  );
  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };
  const checkIfWalletAvailable = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        setCurrentAccount(accounts[0]);
        if (!accounts.length) {
          console.log("No accounts found");
        }
      } else {
        return alert("Please install MetaMask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask");

      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            value: parsedAmount._hex,
            gas: "0x5208",
          },
        ],
      });

      const txHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`Loading... ${txHash.hash}`);

      await txHash.wait();

      setIsLoading(false);
      console.log(`Successful... ${txHash.hash}`);

      let txCount = await transactionContract.getTransactionCount();
      setTransactionCount(txCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletAvailable();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        handleChange,
        sendTransaction,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
