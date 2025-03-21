"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import React from "react";

interface DataTablePaginationProps {
  pageSize: number;
  count: number;
  pageUrlParam?: string;
}

export function DataTablePagination({
  pageSize,
  count,
  pageUrlParam = "page",
}: DataTablePaginationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useQueryState(
    pageUrlParam,
    parseAsInteger.withDefault(1)
  );

  const totalPages = React.useMemo(() => {
    return Math.ceil(count / pageSize);
  }, [pageSize, count]);

  const renderPaginationButtonsParams: RenderPaginationButtonsOnRangeParams =
    React.useMemo(() => {
      return {
        currentPage,
        totalPages,
        range: 3,
      };
    }, [currentPage, totalPages]);

  function handlePreviousPageClick() {
    const newCurrentPage = currentPage - 1;

    if (newCurrentPage <= totalPages) {
      setCurrentPage(newCurrentPage);
    }
  }

  function handleNextPageClick() {
    const newCurrentPage = currentPage + 1;

    if (newCurrentPage <= totalPages) {
      setCurrentPage(newCurrentPage);
    }
  }

  function handlePageNumberClick(page: number) {
    console.log("🚀 ~ handlePageNumberClick ~ page:", page);
    const params = new URLSearchParams();
    params.set("page", page.toString());

    router.push(`${pathname}?${params}`);
    // setCurrentPage(page);
  }

  return (
    <div className="flex items-center justify-between border border-border rounded-md py-2 px-4">
      <div className="flex items-center gap-1">
        <span>
          Total <span className="font-bold">{count}</span>
        </span>
        <span>•</span>
        <span>
          Mostrando <span className="font-bold">{pageSize}</span> por página
        </span>
      </div>
      <Pagination className="w-fit mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousPageClick}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink onClick={() => handlePageNumberClick(1)}>
              <ChevronsLeftIcon />
            </PaginationLink>
          </PaginationItem>

          {renderPaginationButtonsOnRange(renderPaginationButtonsParams).map(
            (button) => (
              <PaginationItem key={button}>
                <PaginationLink
                  isActive={currentPage === button}
                  onClick={() => {
                    console.log("on click trigger");
                    handlePageNumberClick(button);
                  }}
                >
                  {button}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationLink onClick={() => handlePageNumberClick(totalPages)}>
              <ChevronsRightIcon />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={handleNextPageClick}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface RenderPaginationButtonsOnRangeParams {
  currentPage: number;
  totalPages: number;
  range: number;
}

function renderPaginationButtonsOnRange(
  params: RenderPaginationButtonsOnRangeParams
) {
  const { currentPage, totalPages, range } = params;

  const start = Math.max(1, currentPage - range);
  const end = Math.min(totalPages, currentPage + range);

  const pages = [];
  for (let index = start; index <= end; index++) {
    pages.push(index);
  }

  return pages;
}
