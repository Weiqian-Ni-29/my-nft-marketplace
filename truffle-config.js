module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      // gas: 5000000
    }
  },
  contracts_directory : "./src/contracts/", 
  contracts_build_directory:"./src/abis",
  compilers: {
    solc: {
      version:"^0.8.0",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
