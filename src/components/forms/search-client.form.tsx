import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

export function SearchClientForm() {
  return (
    <form>
      <div className="flex items-center gap-2">
        <Input placeholder="Pesquisar cliente" className="w-72" />
        <Button>
          <SearchIcon size="icon" />
        </Button>
      </div>
    </form>
  );
}
