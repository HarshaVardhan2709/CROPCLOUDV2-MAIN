'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { getDashboardPath } from '@/lib/auth';
import { clientFetch } from '@/lib/client-api';
import { Button } from '../ui/button';
import { useAuthStore } from '@/store/auth-store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
  role: z.enum(['BUYER', 'SELLER', 'ADMIN']).optional(),
  companyName: z.string().optional(),
  businessName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const { setSession } = useAuthStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'BUYER',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload =
        mode === 'login'
          ? {
              email: values.email,
              password: values.password,
            }
          : {
              email: values.email,
              password: values.password,
              fullName: values.fullName,
              role: values.role,
              companyName: values.companyName,
              businessName: values.businessName,
            };

      if (mode === 'signup' && !values.fullName) {
        toast.error('Full name is required');
        return;
      }

      const response = await clientFetch<{
        accessToken: string;
        refreshToken: string;
        user: { id: string; email: string; fullName: string; role: string };
        warning?: string;
        message?: string;
        adminStatus?: 'PENDING_APPROVAL' | 'APPROVED';
      }>(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // 🧹 CLEAR OLD STORAGE FIRST (critical for after database reseed)
      localStorage.removeItem('cropcloud-auth');
      localStorage.removeItem('cropcloud-token');
      document.cookie = 'token=; path=/; max-age=0';

      // ✅ Store NEW session in Zustand
      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        role: response.user.role,
        user: response.user,
      });

      // 🔐 Set token cookie with new value
      document.cookie = `token=${response.accessToken}; path=/; max-age=86400`;
      localStorage.setItem('cropcloud-token', response.accessToken);

      // Handle admin approval warnings
      if (response.warning) {
        toast.warning(response.warning);
      } else if (response.message) {
        toast.success(response.message);
      } else {
        toast.success(mode === 'login' ? 'Logged in' : 'Account created');
      }

      // ✅ Redirect based on role
      router.push(getDashboardPath(response.user.role));
    } catch (error) {
      // 🚨 CLEAR ANY PARTIAL SESSION DATA ON LOGIN FAILURE
      localStorage.removeItem('cropcloud-auth');
      localStorage.removeItem('cropcloud-token');
      document.cookie = 'token=; path=/; max-age=0';
      
      // Show error message
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('Auth error:', errorMessage);
      toast.error(errorMessage);
      
      // Do NOT redirect on error - stay on login page
      return;
    }
  });

  return (
    <form onSubmit={onSubmit} className="card-surface space-y-5 p-8">
      {mode === 'signup' && (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Full name
            </label>
            <input
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none"
              {...form.register('fullName')}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Role
            </label>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none"
              {...form.register('role')}
            >
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
              <option value="ADMIN">Admin (requires approval)</option>
            </select>
          </div>
        </>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-black">
          Email
        </label>
        <input
          className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none"
          {...form.register('email')}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black">
          Password
        </label>
        <input
          type="password"
          className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none"
          {...form.register('password')}
        />
      </div>

      {mode === 'signup' && form.watch('role') === 'BUYER' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Company name
          </label>
          <input
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none"
            {...form.register('companyName')}
          />
        </div>
      )}

      {mode === 'signup' && form.watch('role') === 'SELLER' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            Business name
          </label>
          <input
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none"
            {...form.register('businessName')}
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        {mode === 'login' ? 'Login' : 'Create account'}
      </Button>

      <div className="rounded-3xl bg-[#f5f7ef] p-4 text-sm text-black/65">
        Demo: buyer@cropcloud.dev / Buyer@123, seller@cropcloud.dev /
        Seller@123, admin@cropcloud.dev / Admin@123
      </div>
    </form>
  );
}