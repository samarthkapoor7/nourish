export function NourishAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="nourish-grain absolute inset-0 opacity-60" />
      <div className="absolute -top-32 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(252,128,25,0.14)_0%,transparent_70%)] blur-3xl" />
      <div className="absolute top-[40%] -right-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,154,60,0.08)_0%,transparent_70%)] blur-3xl" />
      <div className="absolute bottom-20 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(252,128,25,0.06)_0%,transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b] via-transparent to-[#0b0b0b]" />
    </div>
  );
}
