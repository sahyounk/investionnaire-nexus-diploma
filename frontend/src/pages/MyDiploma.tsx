import { useCallback, useEffect, useState } from "react";
import { formatEther } from "ethers";
import DiplomaCard, { type DiplomaView } from "../components/DiplomaCard";
import { useReadContract, useWriteContract } from "../contract/useContract";
import { useWallet } from "../wallet/WalletProvider";

export default function MyDiploma() {
  const { address, connect, isOnNexus, switchToNexus } = useWallet();
  const getRead = useReadContract();
  const getWrite = useWriteContract();

  const [diploma, setDiploma] = useState<DiplomaView | null>(null);
  const [printFee, setPrintFee] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const c = getRead();
      const tokenId = (await c.diplomaOf(address)) as bigint;
      const fee = (await c.printFeeWei()) as bigint;
      setPrintFee(fee);
      if (tokenId === 0n) {
        setDiploma(null);
        return;
      }
      const r = await c.verifyDiploma(tokenId);
      setDiploma({
        tokenId: tokenId.toString(),
        exists: r[0] as boolean,
        valid: r[1] as boolean,
        studentName: r[2] as string,
        courseName: r[3] as string,
        issueDate: r[4] as bigint,
        graduate: r[5] as string,
        printCount: r[6] as bigint,
        lastPrintDate: r[7] as bigint,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [address, getRead]);

  useEffect(() => {
    load();
  }, [load]);

  async function onPrint() {
    if (!diploma || printFee === null) return;
    setPrinting(true);
    setMsg(null);
    setError(null);
    try {
      const c = await getWrite();
      const tx = await c.payToPrint(BigInt(diploma.tokenId), {
        value: printFee,
      });
      setMsg(`Transaction sent: ${tx.hash}. Waiting for confirmation…`);
      await tx.wait();
      setMsg("Print fee paid. Your diploma's print count was updated.");
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPrinting(false);
    }
  }

  if (!address) {
    return (
      <Centered
        title="Connect your wallet"
        body="Connect the wallet that received your diploma to view it here."
        action={
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
      <Centered
        title="Wrong network"
        body="Switch to the Nexus testnet to read your diploma."
        action={
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-gray-900">My diploma</h1>
      <p className="mt-2 text-gray-600 break-all">
        Wallet:{" "}
        <span className="font-mono text-sm text-gray-800">{address}</span>
      </p>

      {loading && (
        <p className="mt-8 text-gray-500">Loading from Nexus…</p>
      )}

      {!loading && !diploma && (
        <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-100 p-6 text-emerald-800">
          No diploma is registered for this wallet yet.
        </div>
      )}

      {diploma && (
        <div className="mt-8 space-y-6">
          <DiplomaCard d={diploma} />

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="text-lg font-bold text-gray-900">
              Pay-to-print
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Print fee:{" "}
              <span className="font-semibold text-gray-900">
                {printFee !== null ? `${formatEther(printFee)} APEX` : "—"}
              </span>
            </p>
            <button
              onClick={onPrint}
              disabled={printing || !diploma.valid}
              className="mt-4 px-5 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-card disabled:opacity-60"
            >
              {printing ? "Sending…" : "Pay & record print"}
            </button>
            {!diploma.valid && (
              <p className="mt-3 text-sm text-red-600">
                This diploma has been revoked and can't be printed.
              </p>
            )}
          </div>
        </div>
      )}

      {msg && (
        <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800 break-all">
          {msg}
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

function Centered({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
      <p className="mt-3 text-gray-600">{body}</p>
      <div className="mt-8">{action}</div>
    </div>
  );
}
