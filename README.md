# Taker Sowing Auto Farming Bot

![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-green?logo=node.js)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)
![Follow on Telegram](https://img.shields.io/badge/Follow%20on-Telegram-blue?logo=telegram)
![Join WhatsApp Channel](https://img.shields.io/badge/Join-WhatsApp%20Channel-green?logo=whatsapp)
![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue)

A Node.js bot for automating the claiming process on the Taker Sowing platform. This script interacts with the Taker API and smart contracts to perform wallet login and claim transactions, featuring a colorful console interface with an animated ASCII art banner.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Wallet Configuration](#wallet-configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

## Features
- **Automated Claiming**: Automatically logs in and claims rewards for multiple wallets via the Taker Sowing smart contract.
- **Multiple RPC Support**: Tries multiple RPC endpoints to ensure reliable blockchain connectivity.
- **Colorful Logging**: Enhanced console output with colored logs (success, error, wallet, info) for better readability.
- **Animated ASCII Banner**: Displays a dynamic ASCII art banner with rotating frames and colors.
- **Configurable Interval**: Runs claims every 3 hours (configurable via `INTERVAL` constant).
- **Error Handling**: Robust error handling for API calls, RPC connections, and transaction failures.

## Prerequisites
- **Node.js**: Version 16 or higher (tested with Node.js v23.8.0).
- **npm**: Node package manager for installing dependencies.
- **Wallet File**: A `wallet.json` file containing wallet addresses and private keys.
- **Internet Connection**: Required for API calls and blockchain interactions.

## Installation
1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/SCxVBS/Sowing-Taker-Bot.git
   cd taker-sowing-bot
   ```
   Alternatively, download the script files manually.

2. **Install Dependencies**:
   ```bash
   npm install ethers axios
   ```

3. **Prepare Wallet File**:
   Create a `wallet.json` file in the project root with the following format:
   ```json
   [
     { "address": "0xYourWalletAddress1", "privateKey": "0xYourPrivateKey1" },
     { "address": "0xYourWalletAddress2", "privateKey": "0xYourPrivateKey2" }
   ]
   ```
   See [Wallet Configuration](#wallet-configuration) for details.

## Usage
1. **Run the Bot**:
   ```bash
   node index.js
   ```
   The bot will:
   - Display an animated ASCII banner with your Telegram and WhatsApp links.
   - Read wallets from `wallet.json`.
   - Process each wallet (login and claim) every 3 hours.
   - Log progress with colored output (green for success, red for errors, yellow for wallet info, cyan for general info).

2. **Stop the Bot**:
   Press `Ctrl+C` to stop the script.

3. **Monitor Output**:
   The console will show:
   - Animated banner with "Sowing Taker Auto Farming" title.
   - Timestamped logs for each action (login, RPC connection, claim, etc.).
   - Summary of successful claims after each cycle.

## File Structure
```
taker-sowing-bot/
├── index.js          # Main script for the bot
├── wallet.json       # Wallet configuration file (create manually)
├── package.json      # Node.js project configuration
└── README.md         # Project documentation
```

## Wallet Configuration
The `wallet.json` file must contain an array of wallet objects, each with an Ethereum address and private key. Example:
```json
[
  {
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "privateKey": "0xYourPrivateKeyHere"
  },
  {
    "address": "0xabcdef1234567890abcdef1234567890abcdef12",
    "privateKey": "0xAnotherPrivateKeyHere"
  }
]
```
- `address`: Your Ethereum wallet address (with 0x prefix).
- `privateKey`: Your wallet's private key (with 0x prefix, keep secure!).

**Security Note**: Never share your `wallet.json` file or private keys. Store it securely and add it to `.gitignore` if using version control.

## Troubleshooting
- **Error: Cannot find module 'ethers' or 'axios'**:
  Run `npm install ethers axios` to install missing dependencies.

- **Error: Cannot read file 'wallet.json'**:
  Ensure `wallet.json` exists in the project root and is properly formatted.

- **RPC Connection Errors**:
  The bot tries multiple RPC URLs. If all fail, check your internet connection or try adding alternative RPC URLs in the `RPC_URLS` array.

- **Claim Fails with "Already Claimed"**:
  This is normal if the wallet has already claimed for the day. The bot will retry in the next cycle.

- **Banner Misalignment**:
  Use a terminal with a monospaced font (e.g., Fira Code, DejaVu Sans Mono) and ensure the terminal width is at least 50 characters.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the existing style and includes clear comments.

## Contact
For questions, suggestions, or support, reach out via:
- Telegram: [t.me/scxvbs](https://t.me/scxvbs)
- WhatsApp Channel: [Join Channel](https://whatsapp.com/channel/0029VbAR1YL5EjxqhRhOzT3x)

## License
This project is licensed under the MIT License. See the LICENSE file for details.