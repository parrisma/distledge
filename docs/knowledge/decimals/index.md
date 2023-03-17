# Handle Numbers With Decimal Places

## Float Numbers Round up

In Solidity, dividing two uint values will result in rounded down to the nearest integer. This is because Solidity does not support floating point numbers natively.

## Obtaining A Float Number

To obtain a floating point result from a division operation, fixed-point arithmetic can be used to represent fractional values as scaled integers.

For instance, to represent the number 1.23 with 2 decimal places - multiply it by 100 and store it as an integer value of 123. Later when retrieving the value, divide it by 100 to get the original decimal value.

Alternatively, external libraries, such as ABDK Math 64.64 can provide additional support for floating point arithmetic in Solidity. Such libraries implement custom data types and functions to perform arithmetic operations on floating point values, but they may also come with additional gas costs and complexity.
