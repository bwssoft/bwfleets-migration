'use client';

import { Controller } from "react-hook-form";
import { Input } from "../components/ui/input";
import { useBfleetClientFormHandler } from "./search-bfleet-cllient-handler"
import { FilterSortButton } from "../components/ui/filter-sort-button";
import { Button } from "../components/ui/button";
import { SearchIcon } from "lucide-react";
import { FilterClearButton } from "../components/ui/filter-clear-button";

export function SearchBfleetClient() {

  const { form, handleClearFilters, handleSucceededSubmit, isPending, searchParams } = useBfleetClientFormHandler();

  return (
    <form
    onSubmit={form.handleSubmit(handleSucceededSubmit)}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            {...form.register("name")}
            placeholder="Pesquisar por nome do cliente"
            className="w-64"
          />
          <Input
            {...form.register("email")}
            placeholder="Pesquisar por email do cliente"
            className="w-64"
          />
          <Controller
            control={form.control}
            name="nameOrderBy"
            render={({ field }) => (
              <FilterSortButton
                value={field.value}
                onValueChange={field.onChange}
              >
                Nome
              </FilterSortButton>
            )}
          />

           <Button isLoading={isPending} size="icon">
            {!isPending && <SearchIcon />}
          </Button>

          <div>
                      <FilterClearButton
                        isLoading={isPending}
                        onClick={handleClearFilters}
                        nuqsParams={searchParams}
                      />
                    </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button>Cadastrar</Button>
      </div>
    </form>
  )
}