"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/view/components/ui/pagination";
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useRouter } from "next/navigation";

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
  const { refresh } = useRouter();
  const [pageParam, setSearchParam] = useQueryState(
    pageUrlParam,
    parseAsInteger.withDefault(1)
  );

  const currentPage = React.useMemo(() => {
    return Number(pageParam);
  }, [pageParam]);

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
      setSearchParam(newCurrentPage).then(() => {
        refresh();
      });
    }
  }

  function handleNextPageClick() {
    const newCurrentPage = currentPage + 1;

    if (newCurrentPage <= totalPages) {
      setSearchParam(newCurrentPage).then(() => {
        refresh();
      });
    }
  }

  function handlePageNumberClick(page: number) {
    setSearchParam(page).then(() => {
      refresh();
    });
  }

  return (
    <div className="flex items-center text-sm justify-between border border-border rounded-md py-2 px-4">
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
              disabled={pageParam === 1}
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
