import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { Route, Routes } from "react-router-dom";
import { CampaignDetails, CreateCampaign, Home, Profile } from "./pages";
import { Sidebar, Navbar } from "./components";

export function App() {
	return (
		<div className="relative sm:p-8 p-4 bg-[#13131A] min-h-screen flex flex-row">
			<div className="sm:flex hidden mr-10 relative">
				<Sidebar />
			</div>
			<div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
				<Navbar />
			
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/create-campaign" element={<CreateCampaign />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/campaign-details/:id" element={<CampaignDetails />} />

			</Routes>
		</div>
	</div>
	);
}
