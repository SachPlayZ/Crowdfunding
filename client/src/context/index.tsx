import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  readContract,
  toWei,
  type BaseTransactionOptions,
} from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { ethers } from "ethers";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { formatEther } from "ethers";

interface StateContextType {
  address: string;
  contract: any;
  connect: () => Promise<void>;
  createCampaign: (
    title: string,
    description: string,
    target: string,
    deadline: number,
    image: string
  ) => Promise<void>;
  getCampaigns: () => Promise<any[]>;
  getUserCampaigns: () => Promise<any[]>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<any[]>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string>("");
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
        abi : [{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"string","name":"_image","type":"string"}],"name":"createCampaign","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"donateToCampaign","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getCampaigns","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountCollected","type":"uint256"},{"internalType":"string","name":"image","type":"string"},{"internalType":"address[]","name":"donators","type":"address[]"},{"internalType":"uint256[]","name":"donations","type":"uint256[]"}],"internalType":"struct CrowdFunding.Campaign[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getDonators","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfCampaigns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
      });
      setContract(contract);
    };

    initialize();
  }, []);

  const connect = async () => {
    const wallet = createWallet("io.metamask");
    const account = await wallet.connect({ client });
    setAddress(account.address);
    setAccount(account);
    console.log("Connected to wallet", account);
  };

  const createCampaign = async (title: string, description: string, target: string, deadline: number, image: string) => {
    console.log("Creating campaign with:", { title, description, target, deadline, image });

    const preparedTx = prepareContractCall({
      contract,
      method: [
        "0x9943e3a1",
        [
          { internalType: "address", name: "_owner", type: "address" },
          { internalType: "string", name: "_title", type: "string" },
          { internalType: "string", name: "_description", type: "string" },
          { internalType: "uint256", name: "_target", type: "uint256" },
          { internalType: "uint256", name: "_deadline", type: "uint256" },
          { internalType: "string", name: "_image", type: "string" },
        ],
        [{ internalType: "uint256", name: "", type: "uint256" }],
      ],
      params: [
        address,
        title,
        description,
        ethers.parseEther(target), // Ensure `target` is in a valid format
        BigInt(deadline), // Convert `deadline` to `bigint`
        image,
      ],
    });

    try {
      console.log("Creating campaign", preparedTx);
      const tx = await sendTransaction({
        transaction: preparedTx,
        account: account,
      });

      console.log("Contract call success", tx);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  async function getCampaigns(
  ) {
    try {
      const campaigns = await readContract({
        contract: contract,
        method: [
          "0xa6b03633", // This is the method signature for "getCampaigns"
          [],
          [
            {
              "components": [
                { "internalType": "address", "name": "owner", "type": "address" },
                { "internalType": "string", "name": "title", "type": "string" },
                { "internalType": "string", "name": "description", "type": "string" },
                { "internalType": "uint256", "name": "target", "type": "uint256" },
                { "internalType": "uint256", "name": "deadline", "type": "uint256" },
                { "internalType": "uint256", "name": "amountCollected", "type": "uint256" },
                { "internalType": "string", "name": "image", "type": "string" },
                { "internalType": "address[]", "name": "donators", "type": "address[]" },
                { "internalType": "uint256[]", "name": "donations", "type": "uint256[]" }
              ],
              "internalType": "struct CrowdFunding.Campaign[]",
              "name": "",
              "type": "tuple[]"
            }
          ]
        ],
        params: []
      });
  
      // Map the returned campaigns to your desired format
      return campaigns.map((campaign: any, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: formatEther(campaign.target.toString()), // Convert to Ether
        deadline: new Date(Number(campaign.deadline)), // Convert to Date
        amountCollected: formatEther(campaign.amountCollected.toString()), // Convert to Ether
        image: campaign.image,
        pId: i,
      }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign: any) => campaign.owner === address);
  };

  const donate = async (pId: number, amount: string) => {
    console.log("Donating to campaign with:", { pId, amount });
    const preparedTx = prepareContractCall({
      contract,
      method: [
        "0x42a4fda8",
        [{ internalType: "uint256", name: "_id", type: "uint256" }],
        [],
      ],
      params: [BigInt(pId)] as unknown as readonly [
        bigint
      ],
      value: BigInt(toWei(amount)), // Ensure `amount` is in a valid format
    });

    const tx = await sendTransaction({
      transaction: preparedTx,
      account: account,
    });

    return tx;
  };

  async function getDonations(pId: number) {
    try {
      const donations = await readContract({
        contract: contract,
        method: [
          "0x0fa91fa9", // This is the method signature for "getDonators"
          [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            }
          ],
          [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ]
        ],
        params: [BigInt(pId)]
      });
  
      const [donators, amounts] = donations;
  
      return donators.map((donator: string, i: number) => ({
        donator,
        donation: formatEther(amounts[i].toString()),
      }));
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );


};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }
  return context;
};