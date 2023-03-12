# Running The Tests

## Dependencies

[Hardhat](https://www.npmjs.com/package/hardhat)
[chai](https://www.npmjs.com/package/chai)
[web3](https://www.npmjs.com/package/web3)

## Running

### Run all tests

```text
    npx hardhat test
```

### Run specific tests

```text
    npx hardhat test --grep FXDeal
    
    npx hardhat test --grep "FXdeal"
```

This will find all patterns `FXdeal` in the files under test directory and run those tests e.g.

![Test File that will match FXDeal](../docs/resources/run-test-example.png)
