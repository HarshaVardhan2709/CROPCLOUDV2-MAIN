import Link from 'next/link';
import { AuthForm } from '@/components/forms/auth-form';

export default function SignupPage() {
  return (
    
    <div className="container-shell grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[36px] bg-[#eaf1e1] p-10 shadow-md">
        <p className="text-sm uppercase tracking-[0.18em] text-moss/70">Create account</p>
        <h1 className="mt-4 text-4xl font-semibold text-black">Join as a buyer, seller, or admin.</h1>
        <p className="mt-4 text-sm text-black/70">Separate onboarding starts here, with profile creation and role-specific dashboard access. Admin accounts require approval from the primary admin.</p>
      </div>
      <div>
        <AuthForm mode="signup" />
        <p className="mt-4 text-sm text-black/65">
          Already registered? <Link href="/login" className="font-semibold text-moss">Login</Link>
        </p>
      </div>
    </div>
  );
}
