import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { getContract, prepareContractCall, sendTransaction, toWei, type BaseTransactionOptions } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { ethers } from "ethers";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { formatEther } from "ethers";


interface StateContextType {
  address: string | null;
  contract: any;
  connect: () => Promise<void>;
  createCampaign: (form: any) => Promise<void>;
  getCampaigns: () => Promise<any>;
  getUserCampaigns: () => Promise<any>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<any>;
}

const defaultContextValue: StateContextType = {
  address: null,
  contract: null,
  connect: async () => {},
  createCampaign: async () => {},
  getCampaigns: async () => [],
  getUserCampaigns: async () => [],
  donate: async () => null,
  getDonations: async () => [],
};

const StateContext = createContext<StateContextType>(defaultContextValue);


export const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);


  useEffect(() => {
    const initialize = async () => {
      const wallet = createWallet("io.metamask");
      const account = await wallet.connect({ client });
      setAddress(account.address);
      setAccount(account);
      const contract = await getContract({
        client,
        chain: sepolia,
        address: "0xe6078C23896C989Bf440D97fb2AbfD4bA386cB87",
      });
      setContract(contract);
    };

    initialize();
  }, []);

  const connect = async () => {
    const wallet = createWallet("io.metamask");
    const account = await wallet.connect({ client });
    setAddress(account.address);
  };

  const createCampaign = async (form: any) => {
    const preparedTx = prepareContractCall({
      contract,
      method: [
        "0x9943e3a1",
        [
          { "internalType": "address", "name": "_owner", "type": "address" },
          { "internalType": "string", "name": "_title", "type": "string" },
          { "internalType": "string", "name": "_description", "type": "string" },
          { "internalType": "uint256", "name": "_target", "type": "uint256" },
          { "internalType": "uint256", "name": "_deadline", "type": "uint256" },
          { "internalType": "string", "name": "_image", "type": "string" },
        ],
        [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ]
      ],
      params: [
        form.owner,
        form.title,
        form.description,
        form.target,
        form.deadline,
        form.image
      ]
    });

    try {
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      console.log("Contract call success", tx);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    return campaigns.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign: any) => campaign.owner === address);
  };

  const donate = async (pId: number, amount: string) => {
    const preparedTx = prepareContractCall({
      contract,
      method: [
        "0x42a4fda8",
        [
          { "internalType": "uint256", "name": "_id", "type": "uint256" }
        ],
        []
      ],
      params: [pId, toWei(amount)]
    });

    const tx = await sendTransaction({
      transaction: preparedTx,
      account: account,
    });

    return tx;
  };

  const getDonations = async (pId: number) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    return donations[0].map((donator: any, i: number) => ({
      donator,
      donation: formatEther(donations[1][i].toString()),
    }));
  };

  const contextValue: StateContextType = {
    address,
    contract,
    connect,
    createCampaign,
    getCampaigns,
    getUserCampaigns,
    donate,
    getDonations,
  };
  

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateContextProvider");
  }
  return context;
};
