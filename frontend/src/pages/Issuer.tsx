import { useEffect, useState } from "react";
import { isAddress } from "ethers";
import { ROLES } from "../config";
import { useReadContract, useWriteContract } from "../contract/useContract";
import { useWallet } from "../wallet/WalletProvider";

export default function Issuer() {
  const { address, connect, isOnNexus, switchToNexus } = useWallet();
  const getRead = useReadContract();
  const getWrite = useWriteContract();
  const [hasRole, setHasRole] = useState<boolean | null>(null);

  const [graduate, setGraduate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [diplomaURI, setDiplomaURI] = useState("");
  const [revokeId, setRevokeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setHasRole(null);
      return;
    }
    (async () => {
      try {
        const c = getRead();
        const ok = (await c.hasRole(ROLES.ISSUER_ROLE, address)) as boolean;
        setHasRole(ok);
      } catch {
        setHasRole(false);
      }
    })();
  }, [address, getRead]);

  async function issue(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    if (!isAddress(graduate)) {
      setError("Graduate must be a valid 0x address.");
      return;
    }
    setBusy(true);
    try {
      const c = await getWrite();
      const tx = await c.issueDiploma(
        graduate,
        studentName,
        courseName,
        diplomaURI
      );
      setMsg(`Issuing… tx: ${tx.hash}`);
      await tx.wait();
      setMsg("Diploma issued. Refresh /verify to look it up.");
      setStudentName("");
      setCourseName("");
      setDiplomaURI("");
      setGraduate("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function revoke(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    if (!/^\d+$/.test(revokeId)) {
      setError("Token ID must be a number.");
      return;
    }
    setBusy(true);
    try {
      const c = await getWrite();
      const tx = await c.revokeDiploma(BigInt(revokeId));
      setMsg(`Revoking… tx: ${tx.hash}`);
      await tx.wait();
      setMsg(`Diploma #${revokeId} revoked.`);
      setRevokeId("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!address) {
    return (
      <Gate
        title="Issuer console"
        body="Connect a wallet that holds the ISSUER_ROLE."
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
      <Gate
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
  if (hasRole === false) {
    return (
      <Gate
        title="Not an issuer"
        body="This wallet does not hold ISSUER_ROLE on the diploma contract."
        cta={null}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Issuer console
        </h1>
        <p className="mt-2 text-gray-600">
          Mint a new diploma to a graduate's wallet, or revoke one by token ID.
        </p>
      </header>

      <form
        onSubmit={issue}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card space-y-4"
      >
        <h2 className="text-lg font-bold text-gray-900">Issue diploma</h2>
        <Field label="Graduate wallet">
          <input
            value={graduate}
            onChange={(e) => setGraduate(e.target.value)}
            placeholder="0x…"
            className={inputCls}
            required
          />
        </Field>
        <Field label="Student name">
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Course name">
          <input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Diploma metadata URI (e.g. ipfs://…)">
          <input
            value={diplomaURI}
            onChange={(e) => setDiplomaURI(e.target.value)}
            className={inputCls}
            required
          />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-card disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Issue diploma"}
        </button>
      </form>

      <form
        onSubmit={revoke}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card space-y-4"
      >
        <h2 className="text-lg font-bold text-gray-900">Revoke diploma</h2>
        <Field label="Token ID">
          <input
            value={revokeId}
            onChange={(e) => setRevokeId(e.target.value)}
            className={inputCls}
            required
          />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold shadow-card disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Revoke"}
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

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function Gate({
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
