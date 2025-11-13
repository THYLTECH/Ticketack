import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { X } from "lucide-react";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    flag_tabIndex?: number;
    placeholderSearch?: string;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, flag_tabIndex, placeholderSearch = "Search country...", ...props }, ref) => {
      const StableInputComponent = React.useCallback(
        (props: React.ComponentProps<"input">) => (
          <InputComponent
            {...props}
            onClear={() => onChange?.("" as RPNInput.Value)}
          />
        ),
        [onChange]
      );

      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          international
          flagComponent={FlagComponent}
          countrySelectComponent={(props) => (
            <CountrySelect
              {...props}
              flag_tabIndex={flag_tabIndex}
              placeholderSearch={placeholderSearch}
            />
          )}
          inputComponent={StableInputComponent}
          smartCaret={false}
          value={value || undefined}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = "PhoneInput";

type InputComponentProps = React.ComponentProps<"input"> & {
  onClear?: () => void
}

const InputComponent = React.forwardRef<HTMLInputElement, InputComponentProps>(
  ({ className, onClear, value, ...props }, ref) => {
    const showClear = typeof value === "string" && value.length > 0

    return (
      <InputGroup className={cn("rounded-e-lg rounded-s-none", className)}>
        <InputGroupInput {...props} ref={ref} value={value} />

        {showClear && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => onClear?.()}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    )
  }
)


InputComponent.displayName = "InputComponent"


type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  flag_tabIndex?: number;
  placeholderSearch: string;
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  flag_tabIndex,
  placeholderSearch,
  onChange,
}: CountrySelectProps) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  // Laisse Radix monter le popover avant de rendre la liste
  React.useEffect(() => {
    if (!isOpen) {
      setReady(false);
      return;
    }
    const id = setTimeout(() => setReady(true), 10);
    return () => clearTimeout(id);
  }, [isOpen]);

  const filtered = searchValue
    ? countryList.filter((c) =>
        c.label.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : countryList;

  return (
    <Popover
      modal
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
          disabled={disabled}
          tabIndex={flag_tabIndex}
        >
          <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder={placeholderSearch}
          />
          <CommandList>
            <ScrollArea className="h-72">
              {!ready ? (
                <div className="p-3 text-sm opacity-50 h-72 w-full flex items-center justify-center"><Spinner /></div>
              ) : filtered.length === 0 ? (
                <CommandEmpty>No country found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filtered.map(({ value, label }) =>
                    value ? (
                      <CountrySelectOption
                        key={value}
                        country={value}
                        countryName={label}
                        selectedCountry={selectedCountry}
                        onChange={onChange}
                        onSelectComplete={() => setIsOpen(false)}
                      />
                    ) : null,
                  )}
                </CommandGroup>
              )}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};



interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
