# Find size of Contract Bytecode

## Overview

Contracts are limited in size by [EIP-170](https://soliditydeveloper.com/max-contract-size) to 24KB, so we need to ensure we keep our contract sizes as small as possible.

The ```hardhat-contract-sizer``` has been added to this project, and this can report on the KB size of all our contracts.

## To Run

Type ```>yarn hardhat size-contracts```

and you will see a contract size report as below.

```text
 ·-------------------------|---------------------------|----------------·
 |  Solc version: 0.8.17   ·  Optimizer enabled: true  ·  Runs: 200     │
 ··························|···························|·················
 |  Contract Name          ·  Size (KiB)               ·  Change (KiB)  │
 ··························|···························|·················
 |  console                ·                    0.084  ·                │
 ··························|···························|·················
 |  Strings                ·                    0.084  ·                │
 ··························|···························|·················
 |  Math                   ·                    0.084  ·                │
 ··························|···························|·················
 |  SafeMath               ·                    0.084  ·                │
 ··························|···························|·················
 |  UniqueId               ·                    0.330  ·                │
 ··························|···························|·················
 |  VerifySigner           ·                    1.154  ·                │
 ··························|···························|·················
 |  mockVerifiedSigner     ·                    1.906  ·                │
```
