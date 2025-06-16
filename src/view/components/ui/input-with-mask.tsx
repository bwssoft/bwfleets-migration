"use client";

import React from "react";

import { Replacement, useMask } from "@react-input/mask";
import { InputWithAddons, InputWithAddonsProps } from "./input-with-addon";

interface InputWithMaskProps extends InputWithAddonsProps {
  mask?: string;
  replacement?: Replacement;
  error?: string;
}

export function InputWithMask({
  mask,
  replacement,
  readOnly,
  ...rest
}: InputWithMaskProps) {
  const inputRef = useMask({
    mask,
    replacement,
  });

  return (
    <InputWithAddons
      readOnly={readOnly || mask === undefined}
      ref={inputRef}
      {...rest}
    />
  );
}
