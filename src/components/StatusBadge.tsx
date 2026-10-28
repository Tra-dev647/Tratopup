const STYLES: Record<string, { label: string; cls: string; dot: string }> = {
  processing: {
    label: "Processing",
    cls: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400 animate-pulse",
  },
  completed: {
    label: "Completed",
    cls: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  pending_payment: {
    label: "Awaiting payment",
    cls: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    dot: "bg-sky-400 animate-pulse",
  },
  expired: {
    label: "Expired",
    cls: "border-slate-400/30 bg-slate-400/10 text-slate-300",
    dot: "bg-slate-400",
  },
  needs_review: {
    label: "Under review",
    cls: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
  failed: {
    label: "Failed",
    cls: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    dot: "bg-rose-400",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = STYLES[status] ?? STYLES.processing;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
