import { Link, NavLink, Outlet } from "react-router-dom";
import { useWallet } from "../wallet/WalletProvider";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export default function Layout() {
  const { address, connect, connecting, isOnNexus, switchToNexus, hasMetaMask } =
    useWallet();

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-emerald-700"
        : "text-gray-600 hover:text-emerald-600"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/brand/logo.png"
              alt="Investonaire"
              className="h-8 w-auto"
            />
            <span className="hidden sm:inline text-sm font-semibold tracking-wide text-gray-700">
              Diplomas · On-chain
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={navItem}>
              Home
            </NavLink>
            <NavLink to="/verify" className={navItem}>
              Verify
            </NavLink>
            <NavLink to="/my-diploma" className={navItem}>
              My Diploma
            </NavLink>
            <NavLink to="/issuer" className={navItem}>
              Issuer
            </NavLink>
            <NavLink to="/admin" className={navItem}>
              Admin
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {address && !isOnNexus && (
              <button
                onClick={switchToNexus}
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition"
              >
                Switch to Nexus
              </button>
            )}
            <button
              onClick={connect}
              disabled={connecting}
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white bg-brand-gradient hover:opacity-95 transition shadow-card disabled:opacity-60"
            >
              {connecting
                ? "Connecting…"
                : address
                ? shortAddr(address)
                : hasMetaMask
                ? "Connect Wallet"
                : "Install MetaMask"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/brand/logo.png" alt="" className="h-7 w-auto" />
            </div>
            <p className="mt-3 text-sm text-gray-600 max-w-xs">
              Investonaire Academy — empowering African youth to achieve
              financial freedom through education, mentorship, and community.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900 mb-3">On-chain</p>
            <ul className="space-y-2 text-gray-600">
              <li>Network: Nexus Testnet</li>
              <li>Chain ID: 9070</li>
              <li className="break-all">Contract: 0x079c…b7B1</li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900 mb-3">Academy</p>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a
                  href="https://www.investionnaire.com/"
                  className="hover:text-emerald-600"
                >
                  investionnaire.com
                </a>
              </li>
              <li>hello@investonaire.org</li>
              <li>Abuja, Nigeria</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Investonaire Academy · Diplomas
          certified on the Nexus blockchain
        </div>
      </footer>
    </div>
  );
}
