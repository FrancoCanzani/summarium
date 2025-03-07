'use client';

import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { fetchNotes } from '@/lib/api/notes';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user } = useAuth();
  const { id } = useParams();

  const { data: notes } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: () => fetchNotes(user!.id),
    enabled: !!user,
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <div className='flex items-center justify-between w-full'>
            <SidebarGroupLabel>Notes</SidebarGroupLabel>
            <Link
              href={`/notes/${crypto.randomUUID()}`}
              className='hover:underline text-xs'
            >
              New
            </Link>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes &&
                notes.map((item) => (
                  <Link
                    href={`/notes/${item.id}`}
                    key={item.id}
                    className={cn(
                      'flex w-full flex-col items-center gap-1.5 overflow-hidden rounded-md p-1.5 justify-between text-xs hover:bg-sidebar-accent',
                      id === item.id
                        ? 'bg-sidebar-accent font-medium'
                        : 'bg-sidebar'
                    )}
                  >
                    <span className='truncate w-full text-start'>
                      {item.title ?? 'Untitled'}
                    </span>
                    {item.updated_at && (
                      <span className='text-xs text-end w-full text-gray-400'>
                        {formatDistanceToNow(new Date(item.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </Link>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
