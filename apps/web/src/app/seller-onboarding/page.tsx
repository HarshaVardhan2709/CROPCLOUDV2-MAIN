import Link from 'next/link';

export default function SellerOnboardingPage() {
  return (
    <div className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[36px] bg-moss p-8 text-white shadow-md">
          <p className="text-sm uppercase tracking-[0.18em] text-white/65">Seller onboarding</p>
          <h1 className="mt-4 text-4xl font-semibold">Bring your farm, inventory, and service areas online.</h1>
        </div>
        <div className="card-surface p-8">
          <ol className="space-y-4 text-sm text-black/70">
            <li>1. Create a seller account from the signup page.</li>
            <li>2. Complete your seller profile with business and farm details.</li>
            <li>3. Add products through the seller product APIs or extend the dashboard UI.</li>
            <li>4. Define delivery zones and start receiving direct orders.</li>
          </ol>
          <Link href="/signup" className="mt-6 inline-flex rounded-full bg-clay px-5 py-3 text-sm font-semibold text-white">
            Create seller account
          </Link>
        </div>
      </div>
    </div>
  );
}
