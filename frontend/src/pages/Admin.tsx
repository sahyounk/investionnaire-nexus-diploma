import { useEffect, useState } from "react";
import { formatEther, isAddress, parseEther } from "ethers";
import { ROLES } from "../config";
import { useReadContract, useWriteContract } from "../contract/useContract";
import { useWallet } from "../wallet/WalletProvider";

export default function Admin() {
  const { address, connect, isOnNexus, switchToNexus } = useWallet();
  const getRead = useReadContract();
  const getWrite = useWriteContract();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [printFee, setPrintFee] = useState<bigint | null>(null);
  const [treasury, setTreasury] = useState<string>("");
  const [newFee, setNewFee] = useState("");
  const [newTreasury, setNewTreasury] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    (async () => {
      try {
        const c = getRead();
        const ok = (await c.hasRole(
          ROLES.DEFAULT_ADMIN_ROLE,
          address
        )) as boolean;
        setIsAdmin(ok);
        if (ok) {
          setPrintFee((await c.printFeeWei()) as bigint);
          setTreasury((await c.treasury()) as string);
        }
      } catch {
        setIsAdmin(false);
      }
    })();
  }, [address, getRead]);

  async function updateFee(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setError(null);
    try {
      const c = await getWrite();
      const tx = await c.setPrintFee(parseEther(newFee));
      setMsg(`Updating fee… tx: ${tx.hash}`);
      await tx.wait();
      setPrintFee(parseEther(newFee));
      setMsg("Print fee updated.");
      setNewFee("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function updateTreasury(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setError(null);
    if (!isAddress(newTreasury)) {
      setError("Treasury must be a valid 0x address.");
      setBusy(false);
      return;
    }
    try {
      const c = await getWrite();
      const tx = await c.setTreasury(newTreasury);
      setMsg(`Updating treasury… tx: ${tx.hash}`);
      await tx.wait();
      setTreasury(newTreasury);
      setMsg("Treasury updated.");
      setNewTreasury("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!address) {
    return (
      <Center
        title="Admin"
        body="Connect a wallet that holds DEFAULT_ADMIN_ROLE."
        cta={
          <button
            onClick={connect}
            className="px-6 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-card"
          >
            Connect Wallet
          </button>
        }
      />
    );
  }
  if (!isOnNexus) {
    return (
      <Center
        title="Wrong network"
        body="Switch to Nexus testnet."
        cta={
          <button
            onClick={switchToNexus}
            className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold shadow-card"
          >
            Switch to Nexus
          </button>
        }
      />
    );
  }
  if (isAdmin === false) {
    return (
      <Center
        title="Not an admin"
        body="This wallet does not hold DEFAULT_ADMIN_ROLE."
        cta={null}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900">Admin</h1>
        <p className="mt-2 text-gray-600">
          Update the print fee and treasury address.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <Stat
          label="Current print fee"
          value={printFee !== null ? `${formatEther(printFee)} APEX` : "—"}
        />
        <Stat label="Treasury" value={treasury || "—"} mono />
      </div>

      <form
        onSubmit={updateFee}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card space-y-4"
      >
        <h2 className="text-lg font-bold text-gray-900">Update print fee</h2>
        <input
          value={newFee}
          onChange={(e) => setNewFee(e.target.value)}
          placeholder="New fee in APEX (e.g. 0.01)"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
        />
        <button
          disabled={busy}
          className="px-5 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-card disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Update fee"}
        </button>
      </form>

      <form
        onSubmit={updateTreasury}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card space-y-4"
      >
        <h2 className="text-lg font-bold text-gray-900">Update treasury</h2>
        <input
          value={newTreasury}
          onChange={(e) => setNewTreasury(e.target.value)}
          placeholder="0x…"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
        />
        <button
          disabled={busy}
          className="px-5 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-card disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Update treasury"}
        </button>
      </form>

      {msg && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800 break-all">
          {msg}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div
        className={`mt-1 font-semibold text-gray-900 ${
          mono ? "font-mono text-xs break-all" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Center({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: React.ReactNode;
}) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
      <p className="mt-3 text-gray-600">{body}</p>
      {cta && <div className="mt-8">{cta}</div>}
    </div>
  );
}
