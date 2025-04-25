import { LoginForm } from "@/view/forms/login.form";

export default function LoginPage() {
  return (
    <main className="w-screen h-screen flex flex-col gap-8 justify-center items-center">
      {/* <h3 className="font-black text-3xl">BWS</h3> */}

      <LoginForm />
    </main>
  );
}
