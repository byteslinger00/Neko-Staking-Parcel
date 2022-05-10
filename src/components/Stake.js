import { utils } from "near-api-js";
import React from "react";

import { Image, Stack } from "react-bootstrap";
import { Box, Button, Container, Grid, IconButton, Typography, styled, Input, TextField, spacing } from "@mui/material";
import { toast } from "react-toastify";
import { async } from "regenerator-runtime";
import CookieStatic from "../assets/cookie_static.png";
import CookieGif from "../assets/cookie_gif.gif";
const NORMAL_GAS = "150000000000000";
const StyledButton = styled(Button)`
	background-color: #7e181d;
	color: #fdb55a;
	width: 180px;
	height: 60px;
	padding: 6px 18px;
	font-size: 18px;
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
export default function Stake() {
	const [totalStaked, setTotalStaked] = React.useState(0);
	const [nekoBalance, setNekoBalance] = React.useState(0);
	const [accReward, setAccReward] = React.useState(0);
	const [lastUpdate, setLastUpdate] = React.useState(0);
	const [cookieBalance, setCookieBalance] = React.useState(0);
	const [contractBalance, setContractBalance] = React.useState(0);
	const [isRegisteredCookie, setIsRegisteredCookie] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const amountRef = React.useRef(null);
	const stakeRef = React.useRef(null);
	const unstakeRef = React.useRef(null);
	const bakeRef = React.useRef(null);
	const unBakeRef = React.useRef(null);
	React.useEffect(() => {
		if (!window.accountId) return;
		window.contract_factory
			.storage_balance_of({ account_id: window.accountId })
			.then((res) => {
				setIsRegisteredCookie(res);
			})
			.catch((e) => {
				console.log(e.message);
			});
		window.contract_factory
			.ft_balance_of({ account_id: window.accountId })
			.then((res) => {
				setCookieBalance(res);
			})
			.catch((e) => {
				console.log(e.message);
			});
		window.contract.ft_balance_of({ account_id: window.accountId }).then((res) => {
			setNekoBalance(res);
		});
		window.contract_factory.ft_balance_of({ account_id: process.env.REACT_APP_NEKO_CONTRACT_ID }).then((res) => {
			setContractBalance(res);
		});
		getStakeData();
	}, [window.accountId]);
	const getStakeData = async () => {
		try {
			const stakeData = await window.contract.get_stake_by_id({ id: window.accountId });
			setTotalStaked(stakeData.total_stake);
			setAccReward(stakeData.acc_reward);
			setLastUpdate(new Date(stakeData.last_update_time / 1000000).toLocaleString());
			console.log(stakeData);
		} catch (e) {
			console.error(e.message);
		}
	};
	const updateStakeData = async () => {
		setIsLoading(true);
		try {
			await toast.promise(window.contract.update_stake_data({ account_id: window.accountId }), {
				pending: "Loading",
				success: "success",
			});
			getStakeData();
		} catch (e) {
			toast.error(e.message);
		}
		setIsLoading(false);
	};
	const openCookieAccount = async () => {
		await toast.promise(
			window.contract_factory.storage_deposit(
				{ account_id: window.accountId },
				"300000000000000",
				utils.format.parseNearAmount("0.01")
			),
			{
				pending: "Opening...",
				error: `${accountId == "" ? "Connect your Wallet First" : "Error..."}`,
			}
		);
		getStakeData();
	};
	const ftMint = async () => {
		setIsLoading(true);
		console.log(amountRef.current.value);
		try {
			toast.promise(
				window.contract.ft_mint({
					to: window.accountId,
					amount: parseInt(amountRef.current.value),
				}),
				{ pending: "Minting Test Neko", success: "Minted Test Neko", error: "Error Minting Test Neko" }
			);
		} catch (e) {
			toast.error(e.message);
		}
		setIsLoading(false);
	};
	const stake = async () => {
		setIsLoading(true);
		console.log(stakeRef.current.value);
		if (cookieBalance < parseInt(stakeRef.current.value)) {
			toast.error("You don't have enough Cookie!");
			return;
		}
		try {
			await toast.promise(
				window.contract.stake(
					{
						amount: parseInt(stakeRef.current.value),
					},
					"180000000000000",
					1
				),
				{ pending: "Staking Test Neko", success: "Staked Test Neko", error: "Error Staking Test Neko" }
			);
		} catch (e) {
			toast.error(e.message);
		}

		setIsLoading(false);
	};
	const unstake = async () => {
		setIsLoading(true);
		
		if (totalStaked < unstakeRef.current.value) {
			toast.error("You don't have enough staked Cookie!");
			return;
		}

		try {
			await toast.promise(
				window.contract.unstake(
					{
						amount: parseInt(unstakeRef.current.value),
					},
					"180000000000000",
					1
				),
				{ pending: "Unstaking Neko", success: "Unstaked  Neko", error: "Error Unstaking  Neko" }
			);
		} catch (e) {
			toast.error(e.message);
		}

		setIsLoading(false);
	};
	const claimReward = async () => {
		setIsLoading(true);
		try {
			await toast.promise(
				window.contract.claim_neko(
					{
						account_id: window.accountId,
					},
					"300000000000000",
					1
				),
				{ pending: "Claiming Reward", success: "Claimed Reward", error: "Error Claiming Reward" }
			);
		} catch (e) {
			toast.error(e.message);
		}

		setIsLoading(false);
	};
	const bake = async () => {
		setIsLoading(true);
		console.log(nekoBalance, bakeRef.current.value);
		if (nekoBalance < bakeRef.current.value) {
			toast.error("You don't have enough Neko!");
			return;
		}
		try {
			await toast.promise(
				window.contract.bake({ args: { amount: parseInt(bakeRef.current.value) }, amount: 2, gas: NORMAL_GAS }),
				{
					pending: "Baking Neko",
					success: "Baked Neko",
					error: "Error Baking Neko",
				}
			);
		} catch (e) {
			console.log(e.message);
		}
	};
	const unbake = async () => {
		setIsLoading(true);
		
		if (cookieBalance < parseInt(unBakeRef.current.value)) {
			toast.error("You don't have enough Cookie!");
			return;
		}
		try {
			await toast.promise(
				window.contract.unbake({ args: { amount: parseInt(unBakeRef.current.value) }, amount: 1, gas: NORMAL_GAS }),
				{ pending: "Unbaking Neko", success: "Unbaked Neko", error: "Error Unbaking Neko" }
			);
		} catch (e) {
			console.log(e.message);
		}
	};

	return (
		<Box sx={{ mt: 5 }}>
			<div>
				<p style={{ textAlign: "center" }}>Cookie in stock(Vault):{contractBalance} [Dev Only]</p>
			</div>
			{isRegisteredCookie ? (
				<Box>
					<Grid container spacing={2} justifyContent="center">
						<Grid item xs={12} sm={12} sx={{ textAlign: "center" }}>
							<Grid item>
								<Typography
									color={"#EBAD55"}
									className="grow"
									variant="h3"
									fontWeight={"900"}
									sx={{ textShadow: "2px 2px 6px #B78E2B" }}
								>
									FORTUNE COOKIE
								</Typography>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={12} md={4}>
							<Grid item sx={{ pt: 4 }}>
								<div style={{ display: "flex", flexDirection: "column" }}>
									<Box
										sx={{
											minWidth: "350px",
											height: "auto",
											border: "5px solid  #fdb55a",
											textAlign: "center",
											alignSelf: "center",
											padding: "10px",
											margin: "15px",
										}}
									>
										<StyledButton style={{ width: "250px" }} onClick={updateStakeData}>
											Update Stake Data
										</StyledButton>
										<Grid container spacing={2} justifyContent="center">
											<Grid item xs={6}>
												<p>
													Total Staked: <br />
													{totalStaked} $NEKO
												</p>
											</Grid>

											<Grid item xs={6}>
												<p>
													Accrued Reward: <br />
													{accReward} $NEKO
												</p>
											</Grid>
											<Grid item xs={6}>
												<TextField
													variant="filled"
													inputRef={stakeRef}
													type="number"
													defaultValue={"100"}
													style={{ margin: "10px" }}
												/>
												<p>Your Cookie:{cookieBalance}</p>
												<StyledButton onClick={stake}>Stake COOKIE</StyledButton>
												<hr />
												<TextField
													variant="filled"
													inputRef={bakeRef}
													type="number"
													defaultValue={"0"}
													style={{ margin: "10px" }}
												/>
												<p>Your Neko:{nekoBalance}</p>
												<StyledButton onClick={bake}>
													bake
													<br />
													(NEKO->Cookie)
												</StyledButton>
											</Grid>
											<Grid item xs={6}>
												<TextField
													variant="filled"
													inputRef={unstakeRef}
													type="number"
													defaultValue={"0"}
													style={{ margin: "10px" }}
												/>
												<p>Total Staked:{totalStaked}</p>
												<StyledButton onClick={unstake}>Unstake</StyledButton>
												<hr />
												<TextField
													variant="filled"
													inputRef={unBakeRef}
													type="number"
													defaultValue={"0"}
													style={{ margin: "10px" }}
												/>
												<p>Your Cookie:{cookieBalance}</p>
												<StyledButton onClick={unbake}>
													Unbake
													<br />
													(Cookie->Neko)
												</StyledButton>
											</Grid>

											<Grid item xs={12}>
												<StyledButton style={{ background: "#7e181d", color: "#fdb55a" }} onClick={claimReward}>
													Claim NEKO
												</StyledButton>
												<p>Last Update:{lastUpdate}</p>
											</Grid>
										</Grid>
									</Box>
								</div>
							</Grid>
						</Grid>
						<Grid item xs={12} sm={12} md={4}>
							<Grid itemxs={12} sx={{ pt: 5 }}>
								<div className="vertical-flip-container flip-container">
									<div className={isLoading ? "flipper" : "not-flipper"}>
										{!isLoading ? (
											<div className="front">
												<Image src={CookieStatic} style={{ width: "250px" }} className="catheader-img" />
											</div>
										) : (
											<div className="back">
												<Image src={CookieGif} style={{ width: "250px" }} className="catheader-img" />
											</div>
										)}
									</div>
								</div>
							</Grid>
							<Grid itemxs={12} sx={{ pt: 4 }}>
								<StyledButton onClick={ftMint}>Mint Some Test Neko!</StyledButton>
								<TextField variant="filled" inputRef={amountRef} type="number" defaultValue={"100"} />
							</Grid>
						</Grid>
					</Grid>
				</Box>
			) : (
				<>
					<Grid container spacing={2} justifyContent="center">
						<Grid item xs={12} sx={{ textAlign: "center" }}>
							<Grid item>
								<Typography
									color={"#EBAD55"}
									className="grow"
									variant="h3"
									fontWeight={"900"}
									sx={{ textShadow: "2px 2px 6px #B78E2B" }}
								>
									GOOD FORTUNE FELINES
								</Typography>
							</Grid>
							<Grid item sx={{ pt: 4 }}>
								<Typography variant="subtitle1">you dont have cookie account</Typography>
							</Grid>
							<Grid item sx={{ pt: 4 }}>
								<StyledButton onClick={openCookieAccount}>Open Cookie Account</StyledButton>
							</Grid>
						</Grid>
					</Grid>
				</>
			)}
		</Box>
	);
}
