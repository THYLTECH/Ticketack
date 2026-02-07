import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react' // Ajout de l'icône X

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useInitials } from '@/hooks/use-initials'
import { useTrans } from '@/lib/translation'

interface Avatar {
  id: number;
  url: string;
  file_name: string;
  file_path: string;
  file_extension: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
  description: string | null;
  title: string | null;
}

interface MultiSelectAvatarsProps {
  users: {
    id: number;
    name: string;
    avatar: Avatar;
    attachment_avatar: number;
  }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
};

const MultiSelectAvatars = ({ users, selectedIds, onSelectionChange }: MultiSelectAvatarsProps) => {
  const __ = useTrans();
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const getInitials = useInitials();

  const isAllSelected = users.length > 0 && selectedIds.length === users.length;

  const toggleUser = (userId: string) => {
    const next = selectedIds.includes(userId.toString())
      ? selectedIds.filter((id) => id.toString() !== userId.toString())
      : [...selectedIds, userId.toString()];
    onSelectionChange(next);
  };

  const toggleAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(users.map((u) => u.id.toString()));
    }
  };

  return (
    <div className='w-full max-w-sm space-y-2'>
      <Label htmlFor={id}>{__('components.ui.multi_select.select_users')}</Label>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between pl-2 h-auto min-h-10 hover:bg-background border-input p-1"
          >
            <div className="flex flex-wrap gap-1 items-center max-h-24 overflow-y-auto w-full pr-2 py-1">
              {selectedIds.length > 0 ? (
                selectedIds.map((userId) => {
                  const user = users.find((u) => u.id.toString() === userId.toString())
                  return (
                    <Badge
                      key={userId}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal flex items-center gap-1 shrink-0 group"
                    >
                      <Avatar className='size-4'>
                        <AvatarImage src={user?.avatar?.url} alt={user?.name} />
                        <AvatarFallback className='text-[8px] rounded-full border'>{getInitials(user?.name || '')}</AvatarFallback>
                      </Avatar>
                      {user?.name.split(' ')[0]}

                      <span
                        role="button"
                        className="ml-1 rounded-full outline-none hover:bg-muted-foreground/20 p-0.5"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleUser(userId);
                        }}
                      >
                        <X className="size-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </Badge>
                  )
                })
              ) : (
                <span className="text-muted-foreground ml-1">{__('components.ui.multi_select.placeholder_users')}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-50" align="start">
          <Command className='w-full'>
            <CommandInput placeholder={__('components.ui.multi_select.search_user')} />
            <CommandList>
              <CommandEmpty>{__('components.ui.multi_select.no_item_found')}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={toggleAll}
                  className='flex items-center gap-2 px-2 font-medium cursor-pointer'
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isAllSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {isAllSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span>{isAllSelected ? __('components.ui.multi_select.deselect_all') : __('components.ui.multi_select.select_all')}</span>
                </CommandItem>

                <CommandSeparator className="my-1" />

                {users.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => toggleUser(item.id.toString())}
                    className='flex items-center gap-2 px-2 cursor-pointer'
                  >
                    <div className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedIds.includes(item.id.toString())
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}>
                      <Check className="h-3 w-3" />
                    </div>
                    <Avatar className='size-5'>
                      <AvatarImage src={item.avatar?.url} alt={item.name} className='rounded-full' />
                      <AvatarFallback className='text-[10px]'>{getInitials(item.name)}</AvatarFallback>
                    </Avatar>
                    <span className='truncate'>{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default MultiSelectAvatars