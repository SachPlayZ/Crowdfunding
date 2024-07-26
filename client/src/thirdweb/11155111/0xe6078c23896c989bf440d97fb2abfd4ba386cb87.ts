import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

export async function getCampaigns(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa6b03633",
  [],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "target",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountCollected",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "image",
          "type": "string"
        },
        {
          "internalType": "address[]",
          "name": "donators",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "donations",
          "type": "uint256[]"
        }
      ],
      "internalType": "struct CrowdFunding.Campaign[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "getDonators" function.
 */
export type GetDonatorsParams = {
  id: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_id","type":"uint256"}>
};
export async function getDonators(
  options: BaseTransactionOptions<GetDonatorsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x0fa91fa9",
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
    params: [options.id]
  });
};

export async function numberOfCampaigns(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x07ca140d",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};

export type CreateCampaignParams = {
  owner: AbiParameterToPrimitiveType<{"internalType":"address","name":"_owner","type":"address"}>
title: AbiParameterToPrimitiveType<{"internalType":"string","name":"_title","type":"string"}>
description: AbiParameterToPrimitiveType<{"internalType":"string","name":"_description","type":"string"}>
target: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_target","type":"uint256"}>
deadline: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_deadline","type":"uint256"}>
image: AbiParameterToPrimitiveType<{"internalType":"string","name":"_image","type":"string"}>
};

export function createCampaign(
  options: BaseTransactionOptions<CreateCampaignParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x9943e3a1",
  [
    {
      "internalType": "address",
      "name": "_owner",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "_title",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_description",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "_target",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_deadline",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_image",
      "type": "string"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.owner, options.title, options.description, options.target, options.deadline, options.image]
  });
};


/**
 * Represents the parameters for the "donateToCampaign" function.
 */
export type DonateToCampaignParams = {
  id: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_id","type":"uint256"}>
};

export function donateToCampaign(
  options: BaseTransactionOptions<DonateToCampaignParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x42a4fda8",
  [
    {
      "internalType": "uint256",
      "name": "_id",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.id]
  });
};


