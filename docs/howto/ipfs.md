## access IPFS file
> **WARNING**:  Please make sure the web server is running

### 1. access from backend server 
```curl http://localhost:8191/{optionId}```

### 2. access from IPFS local node gateway
```curl http://localhost:9091/ipfs/{cid}``` 
> **NOTE**: cid can be found in the ```/webserver/term/{optionId}/{signedHash}```.means the content id for each file 
