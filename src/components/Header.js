import React from "react";
import ReactDOM from "react-dom";
import "../styles/header.scss";
import { Image, Stack } from "react-bootstrap";
import FallinesLogo from "../assets/fellines-logo.png";
import { login, logout } from "../utils.js";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Button, styled } from "@mui/material";
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
		background-color: #7e181d;
	}
	&:focus {
		background-color: #7e181d;
		border: 3px solid #f9ba55;
	}
	border-radius: 0px;
`;
const Header = (props) => {
	let connectionButton;
	if (window.accountId == null || typeof window.accountId === "undefined" || accountId == "") {
		connectionButton = (
			<Nav.Link href="/#" style={{ color: "gold" }}>
				<StyledButton className="bold-font btn-transparent header_connect_btn" onClick={() => login()}>
					Connect Wallet
				</StyledButton>
			</Nav.Link>
		);
	} else {
		connectionButton = (
			<Nav.Link href="/#" style={{ color: "gold" }}>
				<StyledButton className="btn btn-danger" onClick={() => logout()}>
					{window.accountId}
				</StyledButton>
			</Nav.Link>
		);
	}

	return (
		<Navbar
			expand="lg"
			className="shadow"
			style={{
				display: "flex",
				background: "rgba(18,18,18,0.5)",
				alignItems: "center",
				width: "100%",
				backgroundImage: ` url(${require("../assets/navbg.png")})`,
				backgroundSize: "cover",
				textAlign: `center`,
			}}
		>
			<Container>
				<Navbar.Brand href="#home">
					<Image src={FallinesLogo} className="logo-header" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/" style={{ color: "gold" }}>
							<StyledButton>Home</StyledButton>
						</Nav.Link>
					</Nav>
					<Nav>
						<Nav.Link href="/nekostake" style={{ color: "gold" }}>
							<StyledButton>
								NEKO Stake
							</StyledButton>
						</Nav.Link>
						<Nav.Link href="/nft" style={{ color: "gold" }}>
							<StyledButton>NFT Stake</StyledButton>
						</Nav.Link>
						<Nav.Link href="/landingpage" stype={{ color: "gold" }}>
							<StyledButton>Landing Page</StyledButton>
						</Nav.Link>
						{connectionButton}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
