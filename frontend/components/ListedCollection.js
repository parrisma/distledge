import { addressConfig } from "../constants";
import { getWeb3Accounts } from "@/lib/AccountUtil";
import { useState, useEffect } from "react";
import ListedContract from "../components/ListedContract";

const ListedCollection = (props) => {
  return (
    <div>
      <div>
        <p>Listed Collection</p>
      </div>
      <div>
        <ListedContract />
      </div>
    </div>
  );
};

export default ListedCollection;
