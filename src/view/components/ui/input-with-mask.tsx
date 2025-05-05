"use client";

import React from "react";

import { Replacement, useMask } from "@react-input/mask";
import { InputWithAddons, InputWithAddonsProps } from "./input-with-addon";

interface InputWithMaskProps extends InputWithAddonsProps {
  mask: string;
  replacement?: Replacement;
}

export const InputWithMask = React.forwardRef<
  HTMLInputElement,
  InputWithMaskProps
>(({ mask, replacement, ...rest }) => {
  const inputRef = useMask({
    mask,
    replacement,
  });

  return <InputWithAddons ref={inputRef} {...rest} />;
});

InputWithMask.displayName = "InputWithMask";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
// import { cn } from "@shared/utils";
// import { ComponentProps, forwardRef, useState } from "react";
// import { ReactInputMask } from "react-input-mask";
// import { DropdownMenu, Input } from "view/components/@composition";

// type Mask = {
//   label: string;
//   mask: string | Array<string | RegExp>;
// };

// type InputWithMaskProps = ComponentProps<"input"> & {
//   formatters: Mask[];
//   error?: string;
//   label: string;
//   containerClassName?: string;
//   helper?: string;
//   onChange: ({ type, value }: { type: string; value: string }) => void;
// };

// export const InputWithMask = forwardRef<ReactInputMask, InputWithMaskProps>(
//   ({ formatters, label, containerClassName, helper, error, ...props }, ref) => {
//     const [selectedFormatter, setSelectedFormatter] = useState<Mask>(
//       formatters[0]
//     );

//     const onHandleGetMask = () => {
//       return selectedFormatter.mask;
//     };

//     return (
//       <Input.Root className={containerClassName}>
//         {label && (
//           <Input.Label htmlFor={props.id ?? props.name}>{label}</Input.Label>
//         )}

//         <Input.Group>
//           <Input.AddOn
//             className={cn(
//               "rounded-l-md bg-transparent p-2",
//               error && "border-red-500"
//             )}
//           >
//             {/* Quando mais de um validator for fornecido, vai renderizar um dropdown com as escolhas de validações */}
//             {formatters.length > 1 && (
//               <DropdownMenu.Root>
//                 <DropdownMenu.Trigger>
//                   <div
//                     className={cn(
//                       "flex w-16 cursor-pointer items-center justify-center gap-0.5 px-1 font-semibold",
//                       error && "text-red-500"
//                     )}
//                     role="button"
//                   >
//                     <p>{selectedFormatter.label}</p>
//                     <ChevronDownIcon className="mt-0.5 h-4 w-4" />
//                   </div>
//                 </DropdownMenu.Trigger>

//                 <DropdownMenu.Content className="mt-2 w-16 space-y-0 rounded-sm border border-gray-200">
//                   {formatters.map((formatter) => (
//                     <DropdownMenu.Item
//                       key={formatter.label}
//                       onSelect={() => setSelectedFormatter(formatter)}
//                       className="w-full rounded-none text-center"
//                     >
//                       {formatter.label}
//                     </DropdownMenu.Item>
//                   ))}
//                 </DropdownMenu.Content>
//               </DropdownMenu.Root>
//             )}

//             {/* Quando apenas um validator for fornecido, vai somente exibir um addon com aquele valor */}
//             {formatters.length === 1 && (
//               <div className="flex w-16 items-center justify-center gap-0.5 px-1 font-semibold">
//                 <p>{selectedFormatter.label}</p>
//               </div>
//             )}
//           </Input.AddOn>
//           <Input.FieldMask
//             className="rounded-r-md"
//             mask={onHandleGetMask()}
//             {...props}
//             id={props.id ?? props.name}
//             name={props.name ?? props.id}
//             ref={ref}
//           />
//         </Input.Group>

//         <Input.Error show={error !== undefined}>{error}</Input.Error>

//         {helper && <Input.Helper>{helper}</Input.Helper>}
//       </Input.Root>
//     );
//   }
// );
