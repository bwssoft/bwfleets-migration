import { FirstAccessForm } from "@/view/forms/first-access.form";
import { LogoutForm } from "@/view/forms/logout.form";

export default function FirstAccessPage() {
  return (
    <main className="w-screen h-screen flex flex-col gap-8 justify-center items-center">
      <FirstAccessForm />

      <LogoutForm />
    </main>
  );
}
