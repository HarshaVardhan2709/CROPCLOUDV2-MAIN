import Link from 'next/link';
import { AuthForm } from '@/components/forms/auth-form';

export default function LoginPage() {
  return (
    <div className="container-shell grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Left panel - green themed */}
      <div
        className="rounded-[36px] p-10 text-white shadow-md"
        style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)' }}
      >
        <p className="text-sm uppercase tracking-[0.18em] text-white/65">Access marketplace</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight">Login to manage orders, sourcing, and dashboards.</h1>
        <p className="mt-4 text-sm text-white/70">Use the seeded demo accounts or create new buyer and seller accounts.</p>
      </div>

      {/* Right panel - form */}
      <div>
        <AuthForm mode="login" />
        <p className="mt-4 text-sm text-black/65">
          Need an account? <Link href="/signup" className="font-semibold text-[#2d6a4f]">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
