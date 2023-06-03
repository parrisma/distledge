## access IPFS file
> **WARNING**:  Please make sure the server is running

### 1. access from backend server 
```curl http://localhost:8191/{optionId}``` to read term file from the backend server

### 2. access from IPFS local node
```curl http://localhost:9091/ipfs/{cid}``` to read term file from IPFS local node

#### note: cid is the content id of the file, which can be found in the webserver/term/{optionId}/{signedHash}
```2020-11-05 16:02:02.000  INFO 1 --- [nio-