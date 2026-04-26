import { useState } from "react";
import { isAddress } from "ethers";
import { useReadContract } from "../contract/useContract";
import DiplomaCard, { type DiplomaView } from "../components/DiplomaCard";

export default function Verify() {
  const getRead = useReadContract();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [diploma, setDiploma] = useState<DiplomaView | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDiploma(null);
    const value = input.trim();
    if (!value) return;
    setLoading(true);
    try {
      const c = getRead();
      let tokenId: bigint;
      if (isAddress(value)) {
        tokenId = (await c.diplomaOf(value)) as bigint;
        if (tokenId === 0n) {
          setError("No diploma is registered for this wallet.");
          return;
        }
      } else if (/^\d+$/.test(value)) {
        tokenId = BigInt(value);
      } else {
        setError("Enter a token ID (number) or a wallet address (0x…).");
        return;
      }
      const r = await c.verifyDiploma(tokenId);
      const view: DiplomaView = {
        tokenId: tokenId.toString(),
        exists: r[0] as boolean,
        valid: r[1] as boolean,
        studentName: r[2] as string,
        courseName: r[3] as string,
        issueDate: r[4] as bigint,
        graduate: r[5] as string,
        printCount: r[6] as bigint,
        lastPrintDate: r[7] as bigint,
      };
      if (!view.exists) {
        setError(`No diploma exists with token ID ${tokenId.toString()}.`);
        return;
      }
      setDiploma(view);
    } catch (err) {
      setError((err as Error).message ?? "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-gray-900">
        Verify a diploma
      </h1>
      <p className="mt-2 text-gray-600">
        Enter the diploma's token ID or the graduate's wallet address. We'll
        read it directly from Nexus — no servers in the middle.
      </p>

      <form onSubmit={onVerify} className="mt-8 flex flex-col sm:flex-row gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Token ID (e.g. 1) or 0x…"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-card disabled:opacity-60"
        >
          {loading ? "Checking…" : "Verify"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {diploma && (
        <div className="mt-10">
          <DiplomaCard d={diploma} />
        </div>
      )}
    </div>
  );
}
