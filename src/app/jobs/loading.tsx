export default function JobsLoading() {
  return (
    <div className="flex w-full flex-col gap-5 py-2">
      <div>
        <div className="h-6 w-32 rounded-full bg-slate-800/80" />
        <div className="mt-2 h-7 w-64 rounded-full bg-slate-800/80" />
        <div className="mt-2 h-4 w-80 rounded-full bg-slate-900/80" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-slate-900/80"
          />
        ))}
      </div>
    </div>
  );
}

