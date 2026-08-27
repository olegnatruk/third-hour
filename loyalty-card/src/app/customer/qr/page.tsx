import { TopBar } from "@/components/ui";
import { QrPanel } from "./QrPanel";

export default function MyQrPage() {
  return (
    <>
      <TopBar mode="back" title="My QR Code" backHref="/customer" />
      <div className="pt-2">
        <QrPanel />
      </div>
    </>
  );
}
