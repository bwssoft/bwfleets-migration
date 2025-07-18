'use client';

import { Controller } from "react-hook-form";
import { Input } from "../components/ui/input";
import { useMeetingFormhandler } from "./search-meeting-handler";
import { FilterSortButton } from "../components/ui/filter-sort-button";
import { Button } from "../components/ui/button";
import { SearchIcon } from "lucide-react";
import { FilterClearButton } from "../components/ui/filter-clear-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function SearchMeeting() {
  const { form, handleSucceededSubmit, isPending, handleClearFilters, searchParams } = useMeetingFormhandler();

  return (
    <form
    onSubmit={form.handleSubmit(handleSucceededSubmit)}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
          {...form.register("clientName")}
            placeholder="Pesquisar por nome do cliente"
            className="w-64"
          />
          <Controller 
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value ?? ''}  onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status da reunião" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={'pedding'}>
                      <div className="flex items-center gap-2">
                        Pendente
                      </div>
                    </SelectItem>
                    <SelectItem value={'in-progress'}>
                      <div className="flex items-center gap-2">
                        Em andamento
                      </div>
                    </SelectItem>
                    <SelectItem value={'completed'}>
                      <div className="flex items-center gap-2">
                        Concluída
                      </div>
                    </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            control={form.control}
            name="clientNameOrderBy"
            render={({ field }) => (
              <FilterSortButton
                value={field.value}
                onValueChange={field.onChange}
              >
                Nome do Cliente
              </FilterSortButton>
            )}
          />

          <Controller
            control={form.control}
            name="dateOrderBy"
            render={({ field }) => (
              <FilterSortButton
                value={field.value}
                onValueChange={field.onChange}
              >
                Data da reunião
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
              nuqsParams={{
                ...searchParams,
                dateOrderBy: 'desc'
              }}
            />
          </div>
        </div>
      </div>
      <div>
        {/* <MeetingDialog /> */}
      </div>
    </form>
  )
}