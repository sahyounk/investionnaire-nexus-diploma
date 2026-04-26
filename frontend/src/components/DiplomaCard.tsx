import { NEXUS_CHAIN } from "../config";

export type DiplomaView = {
  tokenId: string;
  exists: boolean;
  valid: boolean;
  studentName: string;
  courseName: string;
  issueDate: bigint;
  graduate: string;
  printCount: bigint;
  lastPrintDate: bigint;
};

function fmtDate(seconds: bigint) {
  if (seconds === 0n) return "—";
  return new Date(Number(seconds) * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DiplomaCard({ d }: { d: DiplomaView }) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-card border border-emerald-100 bg-white">
      <div className="h-2 bg-brand-gradient" />
      <div className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
              Investonaire Academy · Diploma #{d.tokenId}
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-gray-900">
              {d.studentName || "Unnamed graduate"}
            </h3>
            <p className="mt-1 text-lg text-gray-700">{d.courseName}</p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              d.valid
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {d.valid ? "Valid" : "Revoked"}
          </span>
        </div>

        <dl className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-gray-500">Issued on</dt>
            <dd className="font-medium text-gray-900">
              {fmtDate(d.issueDate)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Graduate wallet</dt>
            <dd className="font-mono text-xs break-all text-gray-900">
              {d.graduate}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Print count</dt>
            <dd className="font-medium text-gray-900">
              {d.printCount.toString()}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Last print</dt>
            <dd className="font-medium text-gray-900">
              {fmtDate(d.lastPrintDate)}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`${NEXUS_CHAIN.blockExplorerUrls[0]}address/${d.graduate}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View graduate on explorer →
          </a>
        </div>
      </div>
    </div>
  );
}
