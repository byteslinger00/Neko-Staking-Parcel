import { utils } from "near-api-js";
import React from "react";

import { Image, Stack } from "react-bootstrap";
import { Box, Button, Container, Grid, IconButton, Typography, styled, Input, TextField } from "@mui/material";
import { toast } from "react-toastify";
import HelpIcon from "@mui/icons-material/Help";
import { async } from "regenerator-runtime";
import CachedIcon from "@mui/icons-material/Cached";
import { Steps, Hints } from "intro.js-react";
import TokenImg from "../assets/token.png";
const TOKEN_STORAGE_COST = utils.format.parseNearAmount("0.005");
const StyledButton = styled(Button)`
	background-color: #7e181d;
	color: #fdb55a;
	width: 180px;
	height: 60px;
	padding: 6px 18px;
	// font-size: 1.5vmin;
	border: 3px solid #f9ba55;
	&:hover {
		color: #fff;
		border: 3px solid #f9ba55;
	}
	&:focus {
		background-color: #7e181d;
		border: 3px solid #f9ba55;
	}
	border-radius: 0px;
`;
export default function NFTStake() {
	const [ownedNft, setOwnedNft] = React.useState([]);
	const [stakedNft, setStakedNft] = React.useState([]);
	const [totalStaked, setTotalStaked] = React.useState(0);
	//tutorial state

	const [enabled, setEnabled] = React.useState(false);
	const [initialStep, setInitialStep] = React.useState(0);
	const steps = [
		{
			element: "#your-nft",
			intro: "You can see your NFTs here.",
			position: "right",
		},
		{
			element: "#staked-nft",
			intro: "You can see staked NFTs here",
		},
		{
			element: "#your-nft-image",
			intro: "Click on the image to stake your nft",
			position: "right",
		},
		{
			element: "#refresh-reward-rate",
			intro: "Your NFT reward rate will be shown here",
			position: "right",
		},
		{
			element: "#refresh-reward-button",
			intro:
				"Reward rate update every 20 minutes after you stake your NFT,you can refresh the reward rate here (this will cost ~10Tgas)",
			position: "right",
		},
		{
			element: "#claim-reward-button",
			intro: "You can claim your reward without unstake your NFT here",
			position: "right",
		},
		{
			element: "#staked-nft-image",
			intro: "You Click on the image to unstake your nft",
			position: "right",
		},
	];
	const onExit = () => {
		setEnabled(false);
	};
	React.useEffect(() => {
		if (!window.accountId) return;
		get_owned_nft();

		get_staked_nft();
		window.contract.get_all_nft_staked_total({}).then((res) => {
			setTotalStaked(res);
		});
	}, [window.accountId]);
	const get_owned_nft = async () => {
		const owned_nft = await window.contract_nft.nft_tokens_for_owner({ account_id: window.accountId });
		setOwnedNft([...owned_nft]);
	};
	const get_staked_nft = async () => {
		/* 	const allId = await window.contract.nft_get_all_id({}); */

		const chunkSize = 350;
		const array = Array.from({ length: 1608 }, (_, i) => i + 1);
		let temp = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			const chunk = array.slice(i, i + chunkSize);
			let staked_nft = await window.contract.get_is_token_owner_many({
				account_id: window.accountId,
				token_id: chunk,
			});
			temp = temp.concat(staked_nft);
			setStakedNft([...temp]);
			console.log([...temp]);
		}
	};

	const createNekoAccount = async () => {
		await window.contract.storage_deposit(
			{ account_id: window.accountId },
			"300000000000000",
			utils.format.parseNearAmount("0.01")
		);
	};
	const stake_nft = async (tokenId) => {
		await window.contract_nft.nft_approve({
			args: {
				token_id: tokenId,
				account_id: process.env.REACT_APP_NEKO_CONTRACT_ID,
				msg: "stake-approve",
			},
			amount: "500000000000000000000",
			gas: "150000000000000",
		});
	};
	const unstake_nft = async (tokenId) => {
		const unstake = await window.contract.nft_unstake({
			args: { token_id: tokenId },
			amount: TOKEN_STORAGE_COST,
			gas: "150000000000000",
		});
	};
	const nft_refresh_reward = async (tokenId) => {
		await toast.promise(window.contract.nft_refresh_reward({ args: { token_id: tokenId } }), {
			pending: "updating...",
			error: "error",
		});
		get_staked_nft();
	};
	const claim_nft_stake_reward = async (tokenId) => {
		await toast.promise(
			window.contract.claim_nft_stake_reward({ args: { token_id: tokenId }, amount: TOKEN_STORAGE_COST }),
			{
				pending: "updating...",
				error: "error",
			}
		);
		get_staked_nft();
	};

	const parseEstReward = (rewardRate, lastUpdateTime, accReward) => {
		const final = Math.floor(
			(rewardRate * ((Date.now() * 1000000 - lastUpdateTime) / (1000000000 * 1200))) / rewardRate
		);
		return accReward + final * rewardRate;
	};
	return (
		<Box sx={{ mt: 5 }}>
			<Steps
				enabled={enabled}
				steps={steps}
				initialStep={initialStep}
				onExit={onExit}
				options={{ tooltipClass: "steps" }}
			/>
			<Grid container spacing={2} justifyContent="center">
				<Grid item xs={12} sx={{ textAlign: "center" }}>
					<Grid item>
						<Typography
							color={"#EBAD55"}
							className="grow"
							variant="h3"
							fontWeight={"900"}
							sx={{ textShadow: "2px 2px 6px #B78E2B", paddingBottom: "50px" }}
						>
							NFT STAKE
						</Typography>
						<Typography
							color={"#EBAD55"}
							variant="h5"
							fontWeight={"900"}
							sx={{ textShadow: "2px 2px 6px #B78E2B", paddingBottom: "50px" }}
						>
							Total Staked Felines: {totalStaked}
						</Typography>

						<StyledButton onClick={createNekoAccount}>Add NEKO to Near Wallet</StyledButton>
					</Grid>
				</Grid>
			</Grid>
			<Grid container spacing={2} justifyContent="center">
				<Grid item xs={12} sm={12} md={4} className="nft-grid">
					<div style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
						YOUR NFT
						<IconButton onClick={() => setEnabled(true)}>
							<HelpIcon />
						</IconButton>
						<br />
						<small>Click to stake</small>
					</div>
					<div
						style={{ border: "5px solid #fdb55a", padding: "10px", margin: "10px", overflowY: "auto", height: "470px" }}
						id="your-nft"
					>
						<Grid container spacing={3}>
							{ownedNft.length > 0 ? (
								ownedNft.map((nft) => {
									return (
										<Grid key={nft.token_id} item xs={6} sm={6} md={4}>
											<div>
												<Grid item>
													<Grid
														container
														display={"flex"}
														flexDirection={"column"}
														justifyContent={"center"}
														alignItems={"center"}
													>
														<Grid item>
															<img
																id="your-nft-image"
																onClick={() => stake_nft(nft.token_id)}
																src={`https://ewtd.mypinata.cloud/ipfs/QmNtWmU8LuNNexpcw3djhGcdudkUarX8oiovGCZrwrhYR4/${nft.token_id}.png`}
																width="100%"
																style={{ cursor: "pointer" }}
																className="nft-image"
															></img>
														</Grid>
														<Grid item>
															<span>{nft.token_id}</span>
														</Grid>
													</Grid>
												</Grid>
											</div>
										</Grid>
									);
								})
							) : (
								<Grid item xs={6} sm={6} md={4}>
									0 NFTS
								</Grid>
							)}
						</Grid>
					</div>
				</Grid>
				<Grid item xs={12} sm={12} md={4}>
					<div style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
						NFT STAKED
						<IconButton onClick={() => setEnabled(true)}>
							<HelpIcon />
						</IconButton>
						<br />
						<small>Click to unstake</small>
					</div>
					<div
						style={{ border: "5px solid #fdb55a", padding: "10px", margin: "10px", overflowY: "auto", height: "470px" }}
						id="staked-nft"
					>
						<Grid container spacing={3}>
							{stakedNft.map((nft) => {
								return (
									<Grid key={nft.token_id} item xs={6} sm={6} md={4}>
										<div>
											<Grid item>
												<Grid
													container
													display={"flex"}
													flexDirection={"column"}
													justifyContent={"center"}
													alignItems={"center"}
												>
													<Grid item>
														<img
															id="staked-nft-image"
															onClick={() => unstake_nft(nft.token_id)}
															src={`https://ewtd.mypinata.cloud/ipfs/QmNtWmU8LuNNexpcw3djhGcdudkUarX8oiovGCZrwrhYR4/${nft.token_id}.png`}
															style={{ cursor: "pointer" }}
															className="nft-image"
															width="100%"
														></img>
													</Grid>
													<Grid item>
														<span>{nft.token_id}</span>
													</Grid>
													<Grid item>
														<span id="refresh-reward-rate">Reward Rate:{nft.reward_rate}</span>
													</Grid>
													<Grid item>
														<span style={{ textAlign: "center" }}>
															EST Reward:{parseEstReward(nft.reward_rate, nft.last_stake_time, nft.acc_reward)}
														</span>
														{/* 	<IconButton
															id="refresh-reward-button"
															style={{ padding: "3px", width: "auto", height: "auto" }}
															onClick={() => nft_refresh_reward(nft.token_id)}
														>
															<CachedIcon />
														</IconButton> */}
													</Grid>
													<Grid item>
														<span>{/*Traits:{nft.traits_data}*/}</span>
													</Grid>

													<Grid item>
														<StyledButton
															id="claim-reward-button"
															style={{ padding: "4px", width: "auto", height: "auto" }}
															onClick={() => claim_nft_stake_reward(nft.token_id)}
														>
															Claim Reward
														</StyledButton>
													</Grid>
												</Grid>
											</Grid>
										</div>
									</Grid>
								);
							})}
						</Grid>
					</div>
				</Grid>
			</Grid>
		</Box>
	);
}
