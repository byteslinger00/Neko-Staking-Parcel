import { utils } from "near-api-js";
import regeneratorRuntime from "regenerator-runtime";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Header from "../components/Header";
import Stake from "../components/Stake";
import LandingPage from "../components/LandingPage";
import { ToastContainer } from "react-toastify";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import NFTStake from "../components/NFTStake";
import NekoStake from "../components/Stake.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./Admin";
const darkTheme = createTheme({
	typography: {
		h3: {
			fontFamily: "Source Sans Pro",
			fontWeight: "700",
		},
		fontFamily: "Source Sans Pro",
	},

	palette: {
		mode: "dark",
		primary: {
			main: "#EBAD55",
			light: "#90f2f7",
		},
		secondary: {
			main: "#fbf9f8",
		},
		background: {
			default: "#972F34",
			paper: "#181818",
		},
		warning: {
			main: "#ff3d00",
		},
		text: {
			primary: "#EBAD55",
		},
	},
});
const Home = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<div className="home">
				<Header />

				<BrowserRouter>
					<Routes>
						<Route path="/" exact element={<Stake />} />
						<Route path="/nft" exact element={<NFTStake />} />
						<Route path="/nekostake" exact element={<NekoStake />} />
						<Route path="*" element={<NFTStake />} />
						<Route path="/landingpage" element={<LandingPage />} />
						<Route path="/admin" element={<Admin />} />
					</Routes>
				</BrowserRouter>
				<ToastContainer />
			</div>
			<CssBaseline />
		</ThemeProvider>
	);
};

export default Home;
