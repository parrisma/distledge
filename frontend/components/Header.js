import { ConnectButton } from "web3uikit";
import Head from "next/head";

const Header = (props) => {
  return (
    <nav>
      <Head>
        <title>Dist Ledger</title>
        <meta name="description" content="Our Option Smart Contract" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="header-row">
        <div className="header-description">
          <h1 className="header">Distributed Ledger</h1>
        </div>
        <div className="header-connect">
          <ConnectButton className="item-right" moralisAuth={false} />
        </div>
      </div>
    </nav>
  );
};

export default Header;
