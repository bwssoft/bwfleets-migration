"use client";
import React from "react";

export interface IDisclosureComponentProps {
  open: boolean;
  onRequestClose: () => void;
}

export type IUseDisclosureHook<TData> = ReturnType<typeof useDisclosure<TData>>;

export type IDisclosureParams<TData> = {
  default?: TData
}

export function useDisclosure<TData>(params?: IDisclosureParams<TData>) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<TData | undefined>(params?.default);

  const onOpen = React.useCallback(function openDisclosure(_data?: TData) {
    setIsOpen(true);
    if (_data) setData(_data);
  }, []);

  const onClose = React.useCallback(
    function closeDisclosure() {
      setIsOpen(false);
      if (data) setData(undefined);
    },
    [data]
  );

  return {
    isOpen,
    onOpen,
    onClose,
    data,
    setData
  };
}
