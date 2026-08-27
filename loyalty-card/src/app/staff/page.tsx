import { TopBar } from "@/components/ui";
import { Scanner } from "./Scanner";

export default function StaffScannerPage() {
  return (
    <>
      <TopBar mode="back" title="Scan Customer" backHref="/staff" />
      <div className="pt-2">
        <Scanner />
      </div>
    </>
  );
}
