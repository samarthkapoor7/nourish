export default function ActivityPage() {
  const logs = [
    'Scanning restaurants near your saved address',
    'Checking discount eligibility and coupon combinations',
    'Evaluating protein per rupee for lunch and dinner',
    'Monitoring menu changes from top matched restaurants',
    'Preparing fallback meals for stock-outs',
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Nutrition Assistant</h2>
        <p className="text-muted-foreground text-sm">
          Detailed reasoning and execution history for power users.
        </p>
      </div>

      <section className="bg-card rounded-xl p-4 ring-1 ring-white/6">
        <p className="text-sm font-semibold">Plan generation log</p>
        <ol className="mt-4 space-y-2">
          {logs.map((log, index) => (
            <li key={log} className="flex items-start gap-3 rounded-lg bg-white/[0.02] px-3 py-2.5">
              <span className="text-muted-foreground w-12 shrink-0 font-mono text-xs">
                11:0{index + 1}
              </span>
              <span className="text-sm">{log}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-card rounded-xl p-4 ring-1 ring-white/6">
        <p className="text-sm font-semibold">Why today&apos;s lunch was selected</p>
        <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
          <li>• Highest protein among nearby options</li>
          <li>• ₹48 cheaper than yesterday&apos;s lunch</li>
          <li>• Keeps budget room for dinner</li>
          <li>• Estimated delivery time under 20 minutes</li>
        </ul>
      </section>
    </div>
  );
}
