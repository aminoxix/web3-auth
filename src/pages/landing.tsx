// next
import type { NextPage } from "next";

// contexts
import { useWalletContext } from "@contexts/WalletProvider";

const Home: NextPage = () => {
  const wallet = useWalletContext();
  const handleLogin = () => {
    const walletLogin = wallet.login();
    console.log("walletLogin", walletLogin);
  };

  return (
    <div>
      <button disabled={wallet.connecting} onClick={handleLogin}>
        login
      </button>
    </div>
  );
};

export default Home;
