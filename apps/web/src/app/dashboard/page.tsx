import Link from 'next/link';

const items = [
  { href: '/dashboard/buyer', title: 'Buyer Dashboard', body: 'Orders, spend, and sourcing alerts.' },
  { href: '/dashboard/seller', title: 'Seller Dashboard', body: 'Inventory, low stock, payouts, and incoming orders.' },
  { href: '/dashboard/admin', title: 'Admin Dashboard', body: 'Platform metrics and seller approvals.' },
  { href: '/dashboard/logistics', title: 'Logistics Dashboard', body: 'Delivery status and operational visibility.' },
];

export default function DashboardIndexPage() {
  return (
    <div className="container-shell py-10">
      <h1 className="text-4xl font-semibold text-black">Dashboards</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="card-surface p-6">
            <h2 className="text-xl font-semibold text-black">{item.title}</h2>
            <p className="mt-3 text-sm text-black/65">{item.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
