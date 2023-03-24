import { ConnectButton } from "web3uikit";
import Link from "next/link"

export default function Header(params) {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-blog text-3xl">Distributed Ledger</h1>
      <div className="ml-auto py-2 px-4">
      <div className="flex flex-row items-center">
                <Link legacyBehavior href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link legacyBehavior href="/escrow">
                    <a className="mr-4 p-6">Escrow</a>
                </Link>
        <ConnectButton moralisAuth={false} />
        </div>
      </div>
    </nav>
  );
}
