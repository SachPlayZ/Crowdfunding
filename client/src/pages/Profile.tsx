import React, { useState, useEffect } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: Date;
  amountCollected: string;
  image: string;
  pId: number;
}

const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async (): Promise<void> => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile;
