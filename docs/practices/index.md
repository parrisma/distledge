# Team Best Practice

## We use main

The target branch for all code is ```main```

## Always write tests

Ensure that for every contract there is an associated test

```text
   contracts\myContract.sol
   test\myContract.js
```

## Always run tests before merge

Make sure all tests pass before merging to main

1. npx hardhat clean
2. npx hardhat test
3. commit with a **detailed** comment ```commit -m "a very clear comment"```
