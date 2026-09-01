import { CoffeePourLoader } from "@/components/ui";

/** App-wide fallback for route segments while their data streams in. */
export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="flex min-h-dvh flex-1 items-center justify-center px-7 py-12"
    >
      <CoffeePourLoader />
    </main>
  );
}
