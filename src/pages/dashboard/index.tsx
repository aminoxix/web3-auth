// next
import type { NextPage } from "next";
import Link from "next/link";

// contexts
import { useWalletContext } from "@contexts/WalletProvider";

const Dashboard: NextPage = () => {
  const wallet = useWalletContext();

  const handleLogout = () => {
    wallet.logout();
  };

  return (
    <div>
      <Link href="/dashboard/deposit">deposit</Link>
      <Link href="/dashboard/send">send</Link>
      <button disabled={wallet.connecting} onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};

export default Dashboard;
