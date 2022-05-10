import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig("testnet");

// Initialize contract & set global variables
export async function initContract() {
	// Initialize connection to the NEAR testnet
	const near = await connect(
		Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig)
	);

	// Initializing Wallet based Account. It can work with NEAR testnet wallet that
	// is hosted at https://wallet.testnet.near.org
	window.walletConnection = new WalletConnection(near);

	// Getting the Account ID. If still unauthorized, it's just empty string
	window.accountId = window.walletConnection.getAccountId();

	// Initializing our contract APIs by contract name and configuration
	window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
		// View methods are read only. They don't modify the state, but usually return some value.
		viewMethods: [
			"get_stake_by_id",
			"get_nft_stake_by_id",
			"ft_balance_of",
			"get_nft_stake_by_account",
			"get_all_nft_staked_total",
			"get_nft_stake_by_account_chunk",
			"get_all_nft_staked_id",
			//Admin
			"get_nft_id",
			"get_interval",
			"get_reward_rate",
			"get_fee_rate",
			"get_traits_reward_rate",
			"ft_total_supply",
			"nft_get_all_id",
			"get_is_token_owner_many",
		],
		// Change methods can modify the state. But you don't receive the returned value when called.
		changeMethods: [
			"stake",
			"ft_mint",
			"bake",
			"unbake",
			"update_stake_data",
			"claim_neko",
			"unstake",
			"nft_unstake",
			"claim_nft_stake_reward",
			"nft_refresh_reward",
			"storage_deposit",
			//ADMIN
			"set_nft_id",
			"upload_traits_value",
			"set_reward_rate",
			"set_bake_fee",
			"set_reward_interval",
			"set_bonus_traits",
			"set_bonus_rate",
		],
	});
	//FACTORY CONTRACT
	window.contract_factory = await new Contract(
		window.walletConnection.account(),
		process.env.REACT_APP_FACTORY_CONTRACT_ID,
		{
			// View methods are read only. They don't modify the state, but usually return some value.
			viewMethods: ["get_stake_by_id", "ft_balance_of", "storage_balance_of"],
			// Change methods can modify the state. But you don't receive the returned value when called.
			changeMethods: ["stake", "ft_mint", "update_stake_data", "storage_deposit"],
		}
	);
	//NFT CONTRACT
	window.contract_nft = await new Contract(window.walletConnection.account(), process.env.REACT_APP_NFT_CONTRACT_ID, {
		viewMethods: ["nft_tokens_for_owner"],
		changeMethods: ["nft_mint", "nft_approve"],
	});
}

export function logout() {
	window.walletConnection.signOut();
	// reload page
	window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
	// Allow the current app to make calls to the specified contract on the
	// user's behalf.
	// This works by creating a new access key for the user's account and storing
	// the private key in localStorage.
	window.walletConnection.requestSignIn(nearConfig.contractName);
}
