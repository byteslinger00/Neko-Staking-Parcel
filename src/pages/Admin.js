import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Admin() {
	const [rewardRate, setRewardRate] = React.useState(0);
	const [feeRate, setFeeRate] = React.useState(0);
	const [traitsRewardRate, setTraitsRewardRate] = React.useState({});
	const [totalSupply, setTotalSupply] = React.useState(0);
	const [interval, setInterval] = React.useState(0);
	const rewardRateRef = React.useRef(null);
	const bakeFeeRef = React.useRef(null);
	const intervalRef = React.useRef(null);
	const traitNameRef = React.useRef(null);
	const traitRewardRef = React.useRef(null);
	const mintTokenAddressRef = React.useRef(null);
	const mintTokenAmountRef = React.useRef(null);
	useState(() => {
		window.contract.get_reward_rate().then((rate) => {
			setRewardRate(rate);
		});
		window.contract.get_fee_rate().then((rate) => {
			setFeeRate(rate);
		});
		window.contract.get_traits_reward_rate().then((rate) => {
			setTraitsRewardRate(rate);
		});
		window.contract.ft_total_supply().then((supply) => {
			setTotalSupply(supply);
		});
		window.contract.get_interval().then((interval) => {
			setInterval(interval);
		});
	}, []);
	const setRewardRateCall = async () => {
		if (rewardRateRef.current.value == "") {
			toast.error("Please input a number");
			return;
		}
		await toast.promise(
			window.contract.set_reward_rate({
				args: {
					rate: parseInt(rewardRateRef.current.value.trim()),
				},
			}),
			{ pending: "updating...", success: "success", error: "error" }
		);
	};
	const setBakeFeeCall = async () => {
		if (bakeFeeRef.current.value == "") {
			toast.error("Please input a number");
			return;
		}
		await toast.promise(
			window.contract.set_bake_fee({
				args: {
					rate: parseInt(bakeFeeRef.current.value.trim()),
				},
			}),
			{ pending: "updating...", success: "success", error: "error" }
		);
	};
	const setIntervalCall = async () => {
		if (intervalRef.current.value == "") {
			toast.error("Please input a number");
			return;
		}
		await toast.promise(
			window.contract.set_reward_interval({
				args: {
					interval: parseInt(intervalRef.current.value.trim()),
				},
			}),
			{ pending: "updating...", success: "success", error: "error" }
		);
	};
	const addTraitReward = async () => {
		if (traitNameRef.current.value == "" || traitRewardRef.current.value == "") {
			toast.error("Invalid Input");
			return;
		}
		await toast.promise(
			window.contract.upload_traits_value({
				args: {
					trait_name: traitNameRef.current.value.trim(),
					reward_value: parseInt(traitRewardRef.current.value.trim()),
				},
			}),
			{ pending: "updating...", success: "success", error: "error" }
		);
	};
	const mintTokenToAddress = async () => {
		if (mintTokenAddressRef.current.value == "" || mintTokenAmountRef.current.value == "") {
			toast.error("Invalid Input");
			return;
		}
		await toast.promise(
			window.contract.ft_mint({
				args: {
					to: mintTokenAddressRef.current.value.trim(),
					amount: parseInt(mintTokenAmountRef.current.value.trim()),
				},
			}),
			{ pending: "updating...", success: "success", error: "error" }
		);
	};
	return (
		<>
			<div style={{ textAlign: "center", marginTop: "20px" }}>
				<h2>NEKO Staking Config</h2>
				<h3>Total circulating supply:{totalSupply}</h3>
				<div> NEKO Stake Reward rate:{rewardRate}%</div>
				<TextField
					label="Reward Rate"
					type={"number"}
					InputProps={{
						endAdornment: (
							<Button onClick={setRewardRateCall} position="end">
								Set
							</Button>
						),
						inputRef: rewardRateRef,
					}}
				></TextField>
				<div>NEKO Baking Fee : {feeRate}%</div>
				<TextField
					label="Baking fee"
					type={"number"}
					InputProps={{
						endAdornment: (
							<Button onClick={setBakeFeeCall} position="end">
								Set
							</Button>
						),
						inputRef: bakeFeeRef,
					}}
				></TextField>
				<div>Set Reward Interval(seconds) </div>
				<TextField
					label="Interval"
					type={"number"}
					InputProps={{
						endAdornment: (
							<Button onClick={setIntervalCall} position="end">
								Set
							</Button>
						),
						inputRef: intervalRef,
					}}
				></TextField>
			</div>
			<div style={{ textAlign: "center", marginTop: "20px" }}>
				<h2>NFT Staking Config</h2>
				<div>
					<h6>Current Reward Traits:</h6>

					{Object.keys(traitsRewardRate).map((trait) => {
						return (
							<div key={trait}>
								{trait} : {traitsRewardRate[trait]} NEKO / {interval} seconds
							</div>
						);
					})}
				</div>
				<br />
				<div>
					<TextField label="Traits Name" InputProps={{ inputRef: traitNameRef }} type={"text"}></TextField>
					<TextField label="Traits Reward Rate" InputProps={{ inputRef: traitRewardRef }} type={"number"}></TextField>
					<Button onClick={addTraitReward}>Add</Button>
				</div>
				<div>
					<h5>Mint Token To Address</h5>
					<TextField
						label="Account ID"
						type={"text"}
						InputProps={{
							endAdornment: (
								<TextField
									label="Amount"
									position="end"
									InputProps={{
										endAdornment: (
											<Button onClick={mintTokenToAddress} position="end">
												Mint
											</Button>
										),
										inputRef: mintTokenAmountRef,
									}}
									type={"number"}
								></TextField>
							),
							inputRef: mintTokenAddressRef,
						}}
					></TextField>
				</div>
			</div>
		</>
	);
}
