export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Orders</h2>
        <p className="text-muted-foreground text-sm">Agent-executed order timeline.</p>
      </div>

      <section className="bg-card rounded-xl p-5 ring-1 ring-white/6">
        <p className="text-sm font-semibold">Current run</p>
        <div className="mt-3 space-y-2 text-sm">
          <p>✓ Connected to Swiggy</p>
          <p>✓ Searching restaurant inventory</p>
          <p>✓ Adding selected meals</p>
          <p>✓ Applying coupons</p>
          <p>✓ Selecting fastest delivery slot</p>
          <p className="text-[#FC8019]">Waiting for payment approval</p>
        </div>
      </section>
    </div>
  );
}
