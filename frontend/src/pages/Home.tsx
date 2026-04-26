import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="bg-brand-gradient-soft">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            The Academy of Future Millionaires
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Diplomas you can{" "}
            <span className="bg-clip-text text-transparent bg-brand-gradient">
              actually trust
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Every Investonaire Academy diploma is issued as a non-transferable
            credential on the Nexus blockchain. Verify in seconds — no email,
            no PDF, no forgery.
          </p>
          <div className="mt-10 flex justify-center gap-3 flex-wrap">
            <Link
              to="/verify"
              className="px-6 py-3 rounded-xl bg-brand-gradient text-white font-semibold shadow-card hover:opacity-95 transition"
            >
              Verify a diploma
            </Link>
            <Link
              to="/my-diploma"
              className="px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-50 transition"
            >
              View my diploma
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid gap-8 md:grid-cols-3">
        {[
          {
            t: "Tamper-proof",
            d: "Diplomas are minted as soulbound ERC-721s on Nexus. They can't be transferred, edited, or faked.",
            tag: "Soulbound",
          },
          {
            t: "Verifiable in 1 click",
            d: "Anyone — recruiters, banks, governments — can confirm a diploma's authenticity with a token ID or wallet address.",
            tag: "Public",
          },
          {
            t: "Pay-to-print",
            d: "Graduates can pay a small on-chain fee to mint a printable, signed copy. Every print is recorded.",
            tag: "On-chain",
          },
        ].map((card) => (
          <div
            key={card.t}
            className="rounded-2xl border border-gray-100 bg-white p-7 shadow-card"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {card.tag}
            </span>
            <h3 className="mt-4 text-xl font-bold text-gray-900">{card.t}</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {card.d}
            </p>
          </div>
        ))}
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-600">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
            From classroom to chain in three steps
          </h2>
          <ol className="mt-10 grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                n: "01",
                t: "Graduate",
                d: "Complete your Investonaire Academy programme.",
              },
              {
                n: "02",
                t: "Issue",
                d: "An academy issuer mints your diploma to your wallet.",
              },
              {
                n: "03",
                t: "Verify",
                d: "Share your token ID or wallet — anyone can verify it.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="rounded-xl bg-white p-6 border border-gray-100"
              >
                <div className="text-emerald-600 font-extrabold text-2xl">
                  {s.n}
                </div>
                <div className="mt-2 font-bold text-gray-900">{s.t}</div>
                <p className="mt-1 text-sm text-gray-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
