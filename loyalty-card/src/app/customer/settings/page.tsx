import { SectionHeading, TopBar } from "@/components/ui";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default function SettingsPage() {
  return (
    <>
      <TopBar mode="back" title="Settings" backHref="/customer" />

      <div className="flex flex-col gap-6 px-7 pb-8 pt-2">
        <SectionHeading
          as="h2"
          title="Change password"
          subtitle="Use at least 8 characters."
        />
        <ChangePasswordForm />
      </div>
    </>
  );
}
