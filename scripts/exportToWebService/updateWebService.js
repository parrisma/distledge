const fs = require("fs");
const { loadSharedConfig } = require("../lib/sharedConfig.js");

const exportAddressName = ".//webserver/constants/contractAddressesConfig.json";

async function main() {
  console.log("Exporting details to WebService");
  console.log('Running from working directory: ' + process.cwd());

  var sharedConfig = loadSharedConfig();
  exportSharedConfigToWebService(sharedConfig);
}


/**
 * Write the current state of the WebService to file.
 */
function exportSharedConfigToWebService(sharedConfig) {
  try {
    fs.writeFile(exportAddressName, JSON.stringify(sharedConfig), function (err) {
      if (err) throw err;
      console.log("Export config to WebService end OK");
    });
  } catch (err) {
    console.log(`Failed to export shared config to WebService with error [${err}]`);
  }
}

main(hre).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
