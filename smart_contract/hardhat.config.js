require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.4",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    network: "rinkeby",
  },
  defaultNetwork: "hardhat",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/z4WpA8UKgqnwbTYmrZu15yCOiijBKaRv",
      accounts: [
        "2f99db8cdb04655028eee1dc98230925202f6b3e010e43fad2883b4bea90a1a3",
      ],
    },
    rinkeby: {
      chainId: 4,
      url: "https://eth-rinkeby.alchemyapi.io/v2/J7jqSgsdLtBGYYvbMF44lFOCeUpiSo_3",
      accounts: [
        "61382da585d0019076d19bc4c1a8504ef79145e94dabd657b00b65df862080b8",
      ],
    },
  },
};
