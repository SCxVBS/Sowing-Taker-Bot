const fs = require('fs');
const axios = require('axios');
const { ethers } = require('ethers');

// Konfigurasi
const INTERVAL = 3 * 60 * 60 * 1000; // 3 jam dalam milidetik
const WALLET_FILE = './wallet.json';
const TAKER_API = 'https://sowing-api.taker.xyz';
const RPC_URLS = [
  'https://rpc-mainnet.taker.xyz/',
  'https://mainnet-openrpc.taker.xyz/',
  'https://rpc.taker.xyz',
  'https://rpc.maplabs.io/base'
];
const CONTRACT_ADDRESS = '0x7b1fcaf088d080aad7bf6aa8f7b4b7d698c4bb73';

// Colors for the log and banner
const colors = [
  '\x1b[31m', // red
  '\x1b[32m', // green
  '\x1b[34m', // blue
  '\x1b[35m', // magenta
  '\x1b[33m', // yellow
  '\x1b[36m'  // cyan
];
const resetColor = '\x1b[0m';
const bold = '\x1b[1m';

// ASCII art frames for the header animation
const headerFrames = [
  [
    '███████╗ ██████╗██╗  ██╗██╗   ██╗██████╗ ███████╗',
    '██╔════╝██╔════╝╚██╗██╔╝██║   ██║██╔══██╗██╔════╝',
    '███████╗██║      ╚███╔╝ ╚██╗ ██╔╝██████╔╝███████╗',
    '╚════██║██║      ██╔██╗  ╚████╔╝ ██╔══██╗╚════██║',
    '███████║╚██████╗██╔╝ ██╗  ╚██╔╝  ██████╔╝███████║',
    '╚══════╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚══════╝'
  ],
  [
    '▓▓▓▓▓▓▓╗ ▓▓▓▓▓▓╗▓▓╗  ▓▓╗▓▓╗   ▓▓╗▓▓▓▓▓▓╗ ▓▓▓▓▓▓▓╗',
    '▓▓╔════╝▓▓╔════╝╚▓▓╗▓▓╔╝▓▓║   ▓▓║▓▓╔══▓▓╗▓▓╔════╝',
    '▓▓▓▓▓▓▓╗▓▓║      ╚▓▓▓╔╝ ╚▓▓╗ ▓▓╔╝▓▓▓▓▓▓╔╝▓▓▓▓▓▓▓╗',
    '╚════▓▓║▓▓║      ▓▓╔▓▓╗  ╚▓▓▓▓╔╝ ▓▓╔══▓▓╗╚════▓▓║',
    '▓▓▓▓▓▓▓║╚▓▓▓▓▓▓╗▓▓╔╝ ▓▓╗  ╚▓▓╔╝  ▓▓▓▓▓▓╔╝▓▓▓▓▓▓▓║',
    '╚══════╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚══════╝'
  ],
  [
    '░░░░░░░╗ ░░░░░░╗░░╗  ░░╗░░╗   ░░╗░░░░░░╗ ░░░░░░░╗',
    '░░╔════╝░░╔════╝╚░░╗░░╔╝░░║   ░░║░░╔══░░╗░░╔════╝',
    '░░░░░░░╝░░║      ╚░░░╔╝ ╚░░╗ ░░╔╝░░░░░░╔╝░░░░░░░╗',
    '╚════░░║░░║      ░░╔░░╗  ╚░░░░╔╝ ░░╔══░░╗╚════░░║',
    '░░░░░░░║╚░░░░░░╗░░╔╝ ░░╗  ╚░░╔╝  ░░░░░░╔╝░░░░░░░║',
    '╚══════╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚══════╝'
  ]
];

// Animation logic for the header
let headerFrameIndex = 0;

function displayHeaderBanner() {
  console.clear();
  const currentFrame = headerFrames[headerFrameIndex];
  currentFrame.forEach((line, index) => {
    const color = colors[index % colors.length];
    console.log(`${color}${line}${resetColor}`);
  });
  console.log(`${bold}${colors[4]}✦ Sowing Taker Auto Farming ✦${resetColor}`);
  console.log(`${colors[5]}Telegram: https://t.me/scxvbs | WhatsApp: https://whatsapp.com/channel/0029VbAR1YL5EjxqhRhOzT3x${resetColor}`);
  console.log();
  headerFrameIndex = (headerFrameIndex + 1) % headerFrames.length;
}

// Fungsi untuk logging dengan warna
function log(message, status = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  let color;
  switch (status) {
    case 'success':
      color = colors[1]; // green
      break;
    case 'error':
      color = colors[0]; // red
      break;
    case 'wallet':
      color = colors[4]; // yellow
      break;
    default:
      color = colors[5]; // cyan
  }
  console.log(`${color}[${timestamp}] ${message}${resetColor}`);
}

// Fungsi untuk menunggu
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk membaca file wallet
function readWallets() {
  try {
    const data = fs.readFileSync(WALLET_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    log(`Error membaca file wallet: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Fungsi untuk login wallet
async function loginWallet(wallet) {
  try {
    log(`Login untuk wallet: ${wallet.address}`, 'wallet');

    // Dapatkan nonce
    const nonceResponse = await axios.post(`${TAKER_API}/wallet/generateNonce`, {
      walletAddress: wallet.address
    }, {
      headers: {
        'content-type': 'application/json',
        'Referer': 'https://sowing.taker.xyz/'
      }
    });

    // Ekstrak pesan nonce
    let message = '';
    if (nonceResponse.data.code === 0 && nonceResponse.data.data) {
      message = nonceResponse.data.data.nonce;
    } else if (nonceResponse.data.code === 200 && nonceResponse.data.result) {
      message = nonceResponse.data.result.nonce;
    } else {
      log('Gagal mendapatkan nonce', 'error');
      return null;
    }

    // Tandatangani pesan
    const wallet_signer = new ethers.Wallet(wallet.privateKey);
    const signature = await wallet_signer.signMessage(message);

    // Login dengan pesan yang ditandatangani
    const loginResponse = await axios.post(`${TAKER_API}/wallet/login`, {
      address: wallet.address,
      signature: signature,
      message: message
    }, {
      headers: {
        'content-type': 'application/json',
        'Referer': 'https://sowing.taker.xyz/'
      }
    });

    // Ekstrak token
    let token = null;
    if (loginResponse.data.code === 0 && loginResponse.data.data) {
      token = loginResponse.data.data.token;
    } else if (loginResponse.data.code === 200 && loginResponse.data.result) {
      token = loginResponse.data.result.token;
    }

    if (!token) {
      log('Gagal mendapatkan token', 'error');
      return null;
    }

    log('Login berhasil', 'success');
    return token;
  } catch (error) {
    log(`Error saat login: ${error.message}`, 'error');
    return null;
  }
}

// Fungsi untuk mendapatkan provider yang berfungsi
async function getWorkingProvider() {
  for (const url of RPC_URLS) {
    try {
      log(`Mencoba RPC: ${url}`);
      const provider = new ethers.JsonRpcProvider(url, undefined, {
        staticNetwork: true,
        timeout: 5000
      });

      // Cek apakah RPC berfungsi dengan mencoba getBlockNumber
      const blockNumber = await provider.getBlockNumber();
      log(`RPC ${url} berfungsi, block number: ${blockNumber}`, 'success');
      return provider;
    } catch (error) {
      log(`RPC ${url} gagal: ${error.message}`, 'error');
    }
  }

  log('Semua RPC gagal, tidak dapat terhubung ke jaringan', 'error');
  return null;
}

// Fungsi untuk claim via kontrak
async function claimViaContract(wallet) {
  try {
    log(`Melakukan claim via kontrak untuk wallet: ${wallet.address}`, 'wallet');

    // Dapatkan provider yang berfungsi
    const provider = await getWorkingProvider();
    if (!provider) {
      log('Tidak dapat menemukan RPC yang berfungsi', 'error');
      return false;
    }

    // Setup signer
    const signer = new ethers.Wallet(wallet.privateKey, provider);

    // Setup kontrak dengan fungsi claim yang terbukti berhasil
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ['function claim() public'],
      signer
    );

    // Estimasi gas terlebih dahulu
    try {
      log('Estimasi gas untuk transaksi claim...');
      const gasEstimate = await contract.claim.estimateGas({
        gasLimit: 200000
      });
      log(`Estimasi gas: ${gasEstimate}`);
    } catch (gasError) {
      log(`Estimasi gas gagal (kemungkinan sudah diklaim hari ini): ${gasError.message}`, 'error');
      return false;
    }

    // Eksekusi transaksi
    log('Mengirim transaksi claim...');
    const tx = await contract.claim({
      gasLimit: 200000
    });
    log(`Transaksi terkirim: ${tx.hash}`, 'success');

    // Tunggu konfirmasi
    log('Menunggu konfirmasi transaksi...');
    const receipt = await tx.wait();
    log(`Transaksi berhasil dikonfirmasi! Hash: ${receipt.hash}`, 'success');

    return true;
  } catch (error) {
    log(`Error saat claim: ${error.message}`, 'error');
    return false;
  }
}

// Fungsi utama untuk memproses satu wallet
async function processWallet(wallet) {
  try {
    displayHeaderBanner();
    log(`\n=== Memproses wallet: ${wallet.address} ===`, 'wallet');

    // 1. Login
    const token = await loginWallet(wallet);
    if (!token) {
      log(`Gagal login untuk wallet: ${wallet.address}`, 'error');
      return false;
    }

    // 2. Langsung lakukan claim via kontrak
    const claimResult = await claimViaContract(wallet);

    if (claimResult) {
      log(`Claim berhasil untuk wallet: ${wallet.address}`, 'success');
      return true;
    } else {
      log(`Claim gagal untuk wallet: ${wallet.address}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Error saat memproses wallet ${wallet.address}: ${error.message}`, 'error');
    return false;
  }
}

// Fungsi utama
async function main() {
  displayHeaderBanner();
  log('=== Bot Claim Taker Sowing ===');

  // Baca daftar wallet
  const wallets = readWallets();
  log(`Ditemukan ${wallets.length} wallet untuk diproses.`);

  while (true) {
    let successCount = 0;

    for (const wallet of wallets) {
      const success = await processWallet(wallet);
      if (success) {
        successCount++;
      }

      // Tunggu sebentar sebelum memproses wallet berikutnya
      await sleep(5000);
    }

    displayHeaderBanner();
    log(`Siklus selesai. ${successCount} dari ${wallets.length} wallet berhasil.`, 'success');

    // Tunggu sampai interval berikutnya
    const nextRunTime = new Date(Date.now() + INTERVAL);
    log(`Menunggu ${INTERVAL / (60 * 60 * 1000)} jam sampai: ${nextRunTime.toLocaleString()}`);
    await sleep(INTERVAL);
  }
}

// Jalankan bot
main().catch(error => {
  log(`Error utama: ${error.message}`, 'error');
  process.exit(1);
});