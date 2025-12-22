import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

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
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useInitials } from '@/hooks/use-initials'

interface MultiSelectAvatarsProps {
  users: any[],
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
};

const MultiSelectAvatars = ({ users, selectedIds, onSelectionChange }: MultiSelectAvatarsProps) => {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const getInitials = useInitials();

  const toggleUser = (userId: string) => {
    const next = selectedIds.includes(userId)
      ? selectedIds.filter((id) => id !== userId)
      : [...selectedIds, userId];
    onSelectionChange(next); // Notifie le parent
  };

  return (

    <div className='w-full max-w-sm space-y-2'>
      <Label htmlFor={id}>Select users</Label>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between pl-2 h-auto min-h-10 hover:bg-background border-input"
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selectedIds.length > 0 ? (
                selectedIds.map((userId) => {
                  const user = users.find((u) => u.id === userId)
                  return (
                    <Badge
                      key={userId}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal flex items-center gap-1"
                    >
                      <Avatar className='size-4'>
                        <AvatarImage src={user?.avatar?.url} alt={user?.name} />
                        <AvatarFallback className='text-[8px] rounded-full border'>{getInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      {user?.name.split(' ')[0]}
                    </Badge>
                  )
                })
              ) : (
                <span className="text-muted-foreground">Select users...</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 z-50"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()} // Solution pour le focus
        >
          <Command className='w-full'>
            <CommandInput placeholder="Search user..." />
            <CommandList onWheel={(e) => e.stopPropagation()}>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {users.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => toggleUser(item.id)}
                    className='flex items-center gap-2 px-2'
                  >
                    <div className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedIds.includes(item.id)
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