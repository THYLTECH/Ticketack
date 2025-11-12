"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
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

/**
 * Represents a selectable option within the Combobox.
 */
export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	selected?: boolean; // NEW: allows preselected options
}

/**
 * Props for the Combobox component.
 */
export interface ComboboxProps {
	/**
	 * The options to display in the combobox.
	 */
	options: ComboboxOption[];

	/**
	 * The current selected value (controlled).
	 */
	value?: string | string[];

	/**
	 * The default value (uncontrolled).
	 */
	defaultValue?: string | string[];

	/**
	 * Callback when the value changes.
	 */
	onValueChange?: (value: string | string[]) => void;

	/**
	 * Placeholder text when no value is selected.
	 */
	placeholder?: string;

	/**
	 * Placeholder text for the search input.
	 */
	searchPlaceholder?: string;

	/**
	 * Message to display when no options match the search.
	 */
	emptyMessage?: string;

	/**
	 * Whether the combobox is disabled.
	 */
	disabled?: boolean;

	/**
	 * Custom className for the trigger button.
	 */
	className?: string;

	/**
	 * Custom className for the popover content.
	 */
	contentClassName?: string;

	/**
	 * Whether to allow deselecting the current value (single mode).
	 */
	allowDeselect?: boolean;

	/**
	 * Custom icon for the trigger button.
	 */
	icon?: React.ReactNode;

	/**
	 * Custom icon for selected items.
	 */
	checkIcon?: React.ReactNode;

	/**
	 * Variant of the trigger button.
	 */
	variant?:
		| "default"
		| "outline"
		| "ghost"
		| "secondary"
		| "destructive"
		| "link";

	/**
	 * Size of the trigger button.
	 */
	size?: "default" | "sm" | "lg" | "icon";

	/**
	 * Whether to show the search input.
	 */
	searchable?: boolean;

	/**
	 * Custom render function for the trigger content.
	 */
	renderTrigger?: (
		selectedOption: ComboboxOption | ComboboxOption[] | undefined,
		isOpen: boolean,
	) => React.ReactNode;

	/**
	 * Custom render function for each option.
	 */
	renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode;

	/**
	 * Group options by a key.
	 */
	groups?: { label: string; options: ComboboxOption[] }[];

	/**
	 * Callback when the popover opens or closes.
	 */
	onOpenChange?: (open: boolean) => void;

	/**
	 * Whether the popover is open (controlled).
	 */
	open?: boolean;

	/**
	 * Align the popover content.
	 */
	align?: "start" | "center" | "end";

	/**
	 * Side of the trigger to place the popover.
	 */
	side?: "top" | "right" | "bottom" | "left";

	/**
	 * Whether the combobox is in a loading state.
	 * When true, displays a loading spinner instead of options.
	 */
	loading?: boolean;

	/**
	 * Name attribute for form submission.
	 * When provided, hidden input(s) will be created with this name.
	 */
	name?: string;

	/**
	 * Whether the field is required for form validation.
	 */
	required?: boolean;

	/**
	 * Enables multiple selection mode.
	 */
	multiple?: boolean;
}

/**
 * A flexible and accessible Combobox component.
 */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
	(props, ref) => {
		const {
			options = [],
			value: controlledValue,
			defaultValue,
			onValueChange,
			placeholder = "Select an option...",
			searchPlaceholder = "Search...",
			emptyMessage = "No results found.",
			disabled = false,
			className,
			contentClassName,
			allowDeselect = false,
			icon,
			checkIcon,
			variant = "outline",
			size = "default",
			searchable = true,
			renderTrigger,
			renderOption,
			groups,
			onOpenChange,
			open: controlledOpen,
			align = "start",
			side = "bottom",
			loading = false,
			name,
			required = false,
			multiple = false,
		} = props;

		// Preselected options if not controlled or provided via defaultValue
		const preselected = React.useMemo(() => {
			if (multiple) {
				return options
					.filter((opt) => opt.selected)
					.map((opt) => opt.value);
			}
			return options.find((opt) => opt.selected)?.value || "";
		}, [options, multiple]);

		// Internal states
		const [internalOpen, setInternalOpen] = React.useState(false);
		const [internalValue, setInternalValue] = React.useState<string | string[]>(
			defaultValue || preselected || (multiple ? [] : "")
		);

		const isControlledValue = Object.prototype.hasOwnProperty.call(props, "value");
		const isControlledOpen = Object.prototype.hasOwnProperty.call(props, "open");

		const open = isControlledOpen ? (controlledOpen ?? false) : internalOpen;
		const value = React.useMemo(
			() =>
				isControlledValue
				? (controlledValue ?? (multiple ? [] : ""))
				: internalValue,
			[isControlledValue, controlledValue, multiple, internalValue],
			);

		const setOpen = React.useCallback(
			(newOpen: boolean) => {
				if (!isControlledOpen) setInternalOpen(newOpen);
				onOpenChange?.(newOpen);
			},
			[isControlledOpen, onOpenChange],
		);

		const setValue = React.useCallback(
			(newValue: string | string[]) => {
				if (!isControlledValue) setInternalValue(newValue);
				onValueChange?.(newValue);
			},
			[isControlledValue, onValueChange],
		);

		const allOptions = React.useMemo(() => {
			if (groups) return groups.flatMap((group) => group.options);
			return options;
		}, [options, groups]);

		// Handle selection logic
		const memoizedValue = React.useMemo(() => value, [value]);

		const handleSelect = React.useCallback(
		(selectedValue: string) => {
			if (multiple) {
			const currentValues = Array.isArray(memoizedValue) ? memoizedValue : [];
			const exists = currentValues.includes(selectedValue);
			const newValues = exists
				? currentValues.filter((v) => v !== selectedValue)
				: [...currentValues, selectedValue];
			setValue(newValues);
			} else {
			const newValue =
				selectedValue === memoizedValue && allowDeselect ? "" : selectedValue;
			setValue(newValue);
			setOpen(false);
			}
		},
		[memoizedValue, allowDeselect, multiple, setValue, setOpen],
		);


		const selectedOptions = multiple
			? allOptions.filter((o) => Array.isArray(value) && value.includes(o.value))
			: allOptions.find((o) => o.value === value);

		// Unified trigger rendering
		const defaultTriggerContent = (
			<div className="flex w-full items-center justify-between gap-2 truncate">
				<div className="flex items-center gap-1 truncate text-left overflow-auto">
					{multiple ? (
						Array.isArray(selectedOptions) && selectedOptions.length > 0 ? (
							selectedOptions.map((opt) => (
								<span
									key={opt.value}
									className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-sm"
								>
									{opt.icon}
									{opt.label}
									{/* <button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleSelect(opt.value);
										}}
										className="ml-1 text-muted-foreground hover:text-foreground"
									>
										<X className="h-3 w-3" />
									</button> */}
								</span>
							))
						) : (
							<span className="text-muted-foreground">{placeholder}</span>
						)
					) : selectedOptions ? (
						<div className="flex items-center gap-2">
							{(selectedOptions as ComboboxOption).icon}
							{(selectedOptions as ComboboxOption).label}
						</div>
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
				</div>
				{icon || <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
			</div>
		);

		const triggerContent = renderTrigger
			? renderTrigger(selectedOptions, open)
			: defaultTriggerContent;

		// Render available options
		const renderOptions = (opts: ComboboxOption[]) =>
			opts.map((option) => {
				const isSelected = multiple
					? Array.isArray(value) && value.includes(option.value)
					: value === option.value;

				const defaultOptionContent = (
					<>
						<div className="flex items-center gap-2">
							{option.icon}
							{option.label}
						</div>
						{checkIcon !== undefined ? (
							checkIcon
						) : (
							<Check
								className={cn(
									"ml-auto h-4 w-4 transition-opacity",
									isSelected ? "opacity-100" : "opacity-0",
								)}
							/>
						)}
					</>
				);

				const optionContent = renderOption
					? renderOption(option, isSelected)
					: defaultOptionContent;

				return (
					<CommandItem
						key={option.value}
						value={option.value}
						onSelect={handleSelect}
						disabled={option.disabled}
					>
						{optionContent}
					</CommandItem>
				);
			});

		return (
			<>
				{name &&
					multiple &&
					Array.isArray(value) &&
					value.map((v) => (
						<input key={v} type="hidden" name={`${name}[]`} value={v} required={required} />
					))}

				{name && !multiple && (
					<input
						type="hidden"
						name={name}
						value={Array.isArray(value) ? "" : value}
						required={required}
					/>
				)}

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							ref={ref}
							variant={variant}
							size={size}
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className={cn("justify-between overflow-hidden text-ellipsis", className)}
						>
							{triggerContent}
						</Button>
					</PopoverTrigger>

					<PopoverContent
						className={cn("w-[var(--radix-popover-trigger-width)] p-0", contentClassName)}
						align={align}
						side={side}
					>
						<Command>
							{searchable && (
								<CommandInput
									placeholder={searchPlaceholder}
									disabled={disabled || loading}
									className="h-9"
								/>
							)}
							<CommandList>
								{loading ? (
									<div className="flex items-center justify-center py-6">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : (
									<>
										<CommandEmpty>{emptyMessage}</CommandEmpty>
										{groups
											? groups.map((group) => (
													<CommandGroup key={group.label} heading={group.label}>
														{renderOptions(group.options)}
													</CommandGroup>
												))
											: options.length !== 0 && (
													<CommandGroup>{renderOptions(allOptions)}</CommandGroup>
												)}
									</>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</>
		);
	},
);

Combobox.displayName = "Combobox";
