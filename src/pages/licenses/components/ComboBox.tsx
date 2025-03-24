import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Framework {
  value: string;
  label: string;
}

interface LicenseFilterComboboxProps {
  options: Framework[];
  value: string;
  setValue: (value: string) => void;
}

export function LicenseFilterCombobox({ options, value, setValue }: LicenseFilterComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Seleccionar filtro..."
          }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-gray-800 border border-gray-700 text-white shadow-lg">
        <Command className="bg-gray-800">
          <CommandInput placeholder="Buscar..." className="bg-gray-800 text-white border-gray-700" />
          <CommandList className="bg-gray-800 text-white">
            <CommandEmpty className="text-gray-400">No se encontraron filtros.</CommandEmpty>
            <CommandGroup className="bg-gray-800">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="hover:bg-gray-700 focus:bg-gray-700 aria-selected:bg-gray-700 text-white"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}