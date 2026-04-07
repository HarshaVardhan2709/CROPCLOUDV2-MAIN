import { formatDate } from '@/lib/utils';

export function TraceabilityTimeline({
  events,
}: {
  events: Array<{ id: string; title: string; description?: string | null; eventAt: string; status: string }>;
}) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="relative rounded-[24px] border border-ink/10 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-moss/70">{event.status}</p>
          <h4 className="mt-1 text-lg font-semibold text-black">{event.title}</h4>
          <p className="mt-2 text-sm text-black/65">{event.description}</p>
          <p className="mt-3 text-xs font-medium text-black/45">{formatDate(event.eventAt)}</p>
        </div>
      ))}
    </div>
  );
}
