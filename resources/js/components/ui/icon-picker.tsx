"use client";

import * as React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideProps, LucideIcon } from 'lucide-react';
import { DynamicIcon, dynamicIconImports, IconName } from 'lucide-react/dynamic';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { iconsData } from "./icons-data";
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import Fuse from 'fuse.js';
import { useDebounceValue } from "usehooks-ts";
import { Spinner } from "./spinner";

export type IconData = typeof iconsData[number];

interface IconPickerProps extends Omit<React.ComponentPropsWithoutRef<typeof PopoverTrigger>, 'onSelect' | 'onOpenChange'> {
  value?: IconName
  defaultValue?: IconName
  onValueChange?: (value: IconName | undefined) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  searchable?: boolean
  searchPlaceholder?: string
  triggerPlaceholder?: string
  iconsList?: IconData[]
  categorized?: boolean
  modal?: boolean
}

const IconRenderer = React.memo(({ name }: { name: IconName }) => {
  return <Icon name={name} />;
});
IconRenderer.displayName = "IconRenderer";

const useIconsData = () => {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadIcons = async () => {
      setIsLoading(true);

      const { iconsData } = await import('./icons-data');
      if (isMounted) {
        setIcons(iconsData.filter((icon: IconData) => {
          return icon.name in dynamicIconImports;
        }));
        setIsLoading(false);
      }
    };

    loadIcons();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { icons, isLoading };
};

const IconPicker = React.forwardRef<
  React.ComponentRef<typeof PopoverTrigger>,
  IconPickerProps
>(({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  children,
  searchable = true,
  searchPlaceholder = "Search for an icon...",
  triggerPlaceholder = "Select an icon",
  iconsList,
  categorized = true,
  modal = false,
  ...props
}, ref) => {
  const [selectedIcon, setSelectedIcon] = useState<IconName | undefined>(defaultValue)
  const [isOpen, setIsOpen] = useState(defaultOpen || false)
  const [search, setSearch] = useDebounceValue("", 100);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const { icons } = useIconsData();
  const [isLoading, setIsLoading] = useState(true);
  
  const currentIcon = value ?? selectedIcon;
  
  const iconsToUse = useMemo(() => iconsList || icons, [iconsList, icons]);
  
  const fuseInstance = useMemo(() => {
    return new Fuse(iconsToUse, {
      keys: ['name', 'tags', 'categories'],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [iconsToUse]);

  const filteredIcons = useMemo(() => {
    if (search.trim() === "") {
      return iconsToUse;
    }
    
    const results = fuseInstance.search(search.toLowerCase().trim());
    return results.map(result => result.item);
  }, [search, iconsToUse, fuseInstance]);
  
  const orderedIcons = useMemo(() => {
    if (search.trim() !== "" || !currentIcon) {
      return filteredIcons;
    }
    
    const selected = filteredIcons.find(icon => icon.name === currentIcon);
    if (!selected) return filteredIcons;

    const rest = filteredIcons.filter(icon => icon.name !== currentIcon);
    return [selected, ...rest];
  }, [filteredIcons, currentIcon, search]);


  const categorizedIcons = useMemo(() => {
    if (!categorized || search.trim() !== "") {
      return [{ name: "", icons: orderedIcons }];
    }

    const categories = new Map<string, IconData[]>();
    
    orderedIcons.forEach(icon => {
      if (icon.categories && icon.categories.length > 0) {
        icon.categories.forEach(category => {
          if (!categories.has(category)) {
            categories.set(category, []);
          }
          categories.get(category)!.push(icon);
        });
      } else {
        const category = "Other";
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category)!.push(icon);
      }
    });
    
    return Array.from(categories.entries())
      .map(([name, icons]) => ({ name, icons }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [orderedIcons, categorized, search]);

  const virtualItems = useMemo(() => {
    const items: Array<{
      type: 'category' | 'row';
      categoryIndex: number;
      rowIndex?: number;
      icons?: IconData[];
    }> = [];

    categorizedIcons.forEach((category, categoryIndex) => {
      items.push({ type: 'category', categoryIndex });
      
      const rows = [];
      for (let i = 0; i < category.icons.length; i += 5) {
        rows.push(category.icons.slice(i, i + 5));
      }
      
      
      rows.forEach((rowIcons, rowIndex) => {
        items.push({ 
          type: 'row', 
          categoryIndex, 
          rowIndex, 
          icons: rowIcons 
        });
      });
    });
    
    return items;
  }, [categorizedIcons]);

  const categoryIndices = useMemo(() => {
    const indices: Record<string, number> = {};
    
    virtualItems.forEach((item, index) => {
      if (item.type === 'category') {
        indices[categorizedIcons[item.categoryIndex].name] = index;
      }
    });
    
    return indices;
  }, [virtualItems, categorizedIcons]);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = virtualItems[index];
      if (item.type === 'category') {
        if (categorizedIcons[item.categoryIndex].name === "") {
          return 1; 
        }
        return 25; 
      }
      return 40; 
    },
    paddingEnd: 2,
    gap: 10,
    overscan: 5,
  });

  const handleValueChange = useCallback((icon: IconName | undefined) => {
    if (value === undefined) {
      setSelectedIcon(icon)
    }

    // Appel de onValueChange avec IconName ou undefined (désélection)
    onValueChange?.(icon);
    
  }, [value, onValueChange]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setSearch("");
    if (open === undefined) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)
    
    setIsPopoverVisible(newOpen);
    
    if (newOpen) {
      setTimeout(() => {
        virtualizer.measure();
        setIsLoading(false);
      }, 1);
    }
  }, [open, onOpenChange, virtualizer]);

  const handleIconClick = useCallback((iconName: IconName) => {
    const isCurrentlySelected = iconName === currentIcon;

    if (isCurrentlySelected) {
      // Désélection : Appel handleValueChange(undefined)
      handleValueChange(undefined);
    } else {
      // Sélection : Appel handleValueChange(iconName) et fermeture
      handleValueChange(iconName);
      setIsOpen(false);
    }
    
    setSearch("");
  }, [handleValueChange, currentIcon]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }
    
    virtualizer.scrollToOffset(0);
  }, [virtualizer]);

  const scrollToCategory = useCallback((categoryName: string) => {
    const categoryIndex = categoryIndices[categoryName];
    
    if (categoryIndex !== undefined && virtualizer) {
      virtualizer.scrollToIndex(categoryIndex, { 
        align: 'start',
        behavior: 'smooth'
      });
    }
  }, [categoryIndices, virtualizer]);

  const categoryButtons = useMemo(() => {
    if (!categorized || search.trim() !== "") return null;
    
    return categorizedIcons.filter(category => category.name !== "").map(category => (
      <Button 
        key={category.name}
        variant={"outline"}
        size="sm"
        className="text-xs"
        onClick={(e) => {
          e.stopPropagation();
          scrollToCategory(category.name);
        }}
      >
        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
      </Button>
    ));
  }, [categorizedIcons, scrollToCategory, categorized, search]);

  const renderIcon = useCallback((icon: IconData) => {
    const isSelected = icon.name === currentIcon;
    
    return (
      <TooltipProvider key={icon.name}>
        <Tooltip>
          <TooltipTrigger
            asChild
          >
            <Button 
              className={cn(
                "p-2 rounded-md border transition",
                "flex items-center justify-center",
              )}
              onClick={() => handleIconClick(icon.name as IconName)}
              size={'icon-lg'}
              variant={isSelected ? 'default' : 'outline'}
            >
              <IconRenderer name={icon.name as IconName} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{icon.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }, [handleIconClick, currentIcon]);

  const renderVirtualContent = useCallback(() => {
    if (orderedIcons.length === 0) {
      return (
        <div className="text-center text-gray-500">
          No icon found
        </div>
      );
    }

    return (
      <div 
        className="relative w-full overscroll-contain"
        style={{ 
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem: VirtualItem) => {
          const item = virtualItems[virtualItem.index];
          
          if (!item) return null;
          
          const itemStyle = {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          };
          
          if (item.type === 'category') {

            const name = categorizedIcons[item.categoryIndex].name;

            if(name === "") {
              return null;
            }

            return (
              <div
                key={virtualItem.key}
                style={itemStyle}
                className="top-0 bg-popover z-10"
              >
                <h3 className="font-medium text-sm capitalize">
                  {name}
                </h3>
                <div className="h-[1px] bg-foreground/10 w-full" />
              </div>
            );
          }
          
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              style={itemStyle}
            >
              <div className="grid grid-cols-5 gap-2 w-full">
                {item.icons!.map(renderIcon)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [virtualizer, virtualItems, categorizedIcons, orderedIcons.length, renderIcon]);

  React.useEffect(() => {
    if (isPopoverVisible) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        virtualizer.measure();
      }, 10);
      
      const resizeObserver = new ResizeObserver(() => {
        virtualizer.measure();
      });
      
      if (parentRef.current) {
        resizeObserver.observe(parentRef.current);
      }
      
      return () => {
        clearTimeout(timer);
        resizeObserver.disconnect();
      };
    }
  }, [isPopoverVisible, virtualizer]);

  const renderTriggerContent = () => {
    if (children) {
      return children;
    }

    if (currentIcon) {
      return (
        <div className="flex items-center gap-2 justify-center w-full">
          <Icon name={currentIcon} className="w-4 h-4" />
          <span className="text-sm">{currentIcon}</span>
        </div>
      );
    }

    return triggerPlaceholder;
  }


  return (
    <Popover open={open ?? isOpen} onOpenChange={handleOpenChange} modal={modal}>
      <PopoverTrigger ref={ref} asChild {...props}>
        <Button 
          variant="outline" 
          className={cn("justify-center relative", !currentIcon && "text-muted-foreground")}
        >
          {renderTriggerContent()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        {searchable && (
          <Input
            placeholder={searchPlaceholder}
            onChange={handleSearchChange}
            className="mb-2"
          />
        )}
        {categorized && search.trim() === "" && (
          <div className="flex flex-row gap-1 mt-2 overflow-x-auto pb-2">
            {categoryButtons}
          </div>
        )}
        <div
          ref={parentRef}
          className="max-h-60 overflow-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          {isLoading ? (
            <div className="h-60 flex items-center justify-center"><Spinner /></div>
          ) : (
            renderVirtualContent()
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});
IconPicker.displayName = "IconPicker";

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

const Icon = React.forwardRef<
  React.ComponentRef<LucideIcon>,
  IconProps
>(({ name, ...props }, ref) => {
  return <DynamicIcon name={name} {...props} ref={ref} />;
});
Icon.displayName = "Icon";

export { IconPicker, Icon, type IconName };