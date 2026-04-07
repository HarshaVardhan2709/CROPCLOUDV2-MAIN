const faqs = [
  ['How does deliverability work?', 'Each seller defines service zones by pincode or radius. Checkout validates the selected address before order creation.'],
  ['When is an order confirmed?', 'COD orders confirm immediately. Razorpay orders confirm only after backend signature verification.'],
  ['Can traceability be extended?', 'Yes. The schema and UI already support batch-based events and can be expanded for audits, warehouse scans, and cold-chain milestones.'],
];

export default function FaqPage() {
  return (
    <div className="container-shell py-10">
      <div className="space-y-5">
        <h1 className="text-4xl font-semibold text-black">FAQ</h1>
        {faqs.map(([title, body]) => (
          <div key={title} className="card-surface p-6">
            <h2 className="text-xl font-semibold text-black">{title}</h2>
            <p className="mt-3 text-sm text-black/68">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
