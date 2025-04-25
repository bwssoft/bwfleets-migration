import { Topbar } from "@/view/components/navigation/topbar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/view/components/ui/breadcrumb";

export default function HomePage() {
  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar>

      <section className="w-full h-full flex items-center justify-center">
        <span>Seja bem-vindo</span>
      </section>
    </main>
  );
}
