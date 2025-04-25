"use client";

import { Button } from "@/view/components/ui/button";
import { FilterSortButton } from "@/view/components/ui/filter-sort-button";
import { Input } from "@/view/components/ui/input";
import { Label } from "@/view/components/ui/label";
import { Switch } from "@/view/components/ui/switch";
import { SearchIcon, XIcon } from "lucide-react";

import { Controller } from "react-hook-form";

import {
  CLIENT_MIGRATION_STATUS_OPTIONS,
  useSearchClientFormHandler,
} from "./search-client.handler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/view/components/ui/dialog";

import { MultiSelectCombobox } from "@/view/components/ui/multi-select-combobox";
import { ExtraFiltersButton } from "@/view/components/ui/extra-filters-button";
import { FilterClearButton } from "@/view/components/ui/filter-clear-button";

export function SearchClientForm() {
  const {
    form,
    isPending,
    handleSucceededSubmit,
    handleFailedSubmit,
    handleClearFilters,
    filterDisclosure,
    searchParams,
  } = useSearchClientFormHandler();

  return (
    <form
      onSubmit={form.handleSubmit(handleSucceededSubmit, handleFailedSubmit)}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            {...form.register("name")}
            placeholder="Pesquisar por nome do cliente"
            className="w-64"
          />

          <Controller
            control={form.control}
            name="devicesOrderBy"
            render={({ field }) => (
              <FilterSortButton
                value={field.value}
                onValueChange={field.onChange}
              >
                Dispositivos
              </FilterSortButton>
            )}
          />

          <ExtraFiltersButton
            onClick={filterDisclosure.onOpen}
            nuqsParams={searchParams}
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

      <Dialog
        open={filterDisclosure.isOpen}
        onOpenChange={filterDisclosure.onClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtros adicionais</DialogTitle>
            <DialogDescription>
              Opções de filtros adicionais para cliente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="flex flex-col gap-1">
              <Label>Login</Label>
              <Input {...form.register("login")} />
            </div>

            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label>Status de migração</Label>
                  <MultiSelectCombobox
                    label="Status de migracao"
                    value={field.value ?? []}
                    onChange={field.onChange}
                    options={CLIENT_MIGRATION_STATUS_OPTIONS}
                    renderItem={(option) => (
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    )}
                    renderSelectedItem={(values) => {
                      if (values.length === 0) return "";

                      // Show individual status labels if 3 or fewer items are selected
                      if (values.length <= 2) {
                        return CLIENT_MIGRATION_STATUS_OPTIONS.reduce<string[]>(
                          (accumulator, option) => {
                            if (values.includes(option.value)) {
                              accumulator.push(option.label);
                            }
                            return accumulator;
                          },
                          []
                        ).join(", ");
                      }

                      // Show count if more than 3 items are selected
                      return `${values.length} selecionados`;
                    }}
                  />
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="withSubclients"
              render={({ field }) => (
                <div className="flex flex-col gap-2 text-sm">
                  <Label htmlFor="withSubclients">
                    Incluir subclientes na pesquisa
                  </Label>
                  <Switch
                    id="withSubclients"
                    name="withSubclients"
                    checked={field.value as never}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline">
              <XIcon /> Limpar filtros
            </Button>
            <Button
              onClick={() =>
                form.handleSubmit(handleSucceededSubmit, handleFailedSubmit)()
              }
            >
              <SearchIcon /> Pesquisar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
