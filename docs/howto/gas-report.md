# How To Enable Gas Report

1. In the projec root path, run "yarn"/"npm install" to install "hardhat-gas-reporter" as dev dependency.
1. Create an ".env" file in the projec root path as ".env.template" suggests, if you did not have one.
1. If you don't have an API of below website, sign up and register one. Then fill the API key in the "COINMARKETCAP_API_KEY" of ".env" file you just created.
   https://pro.coinmarketcap.com/
1. In "hardhat.config.js" file, change any field under "gasReporter" to whatever you want. Especially the "token" field if you think the ETH mainnet chain is too expensive in the late report.
1. Run "npx hardhat test"/"yarn hardhat test". Wait until an "gas-report.txt" shows up in the root path. (You may encounter some error message when running test)
1. For more info and details see below link:
   https://www.npmjs.com/package/hardhat-gas-reporter
