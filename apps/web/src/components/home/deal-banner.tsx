import Link from 'next/link';

export function DealBanner() {
  return (
    <section className="container-shell mt-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-surface bg-moss p-8 text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-white/75">Buyer tools</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">Plan procurement with fewer middle layers.</h3>
          <p className="mt-4 text-sm text-white/75">
            Compare seller quality grades, service zones, harvest dates, and live inventory before placing bulk orders.
          </p>
          <Link href="/shop" className="mt-6 inline-flex rounded-full bg-white text-ink px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors">
            Start sourcing
          </Link>
        </div>
      </div>
    </section>
  );
}
