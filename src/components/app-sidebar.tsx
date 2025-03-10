'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { fetchNotes } from '@/lib/api/notes';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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
        <h2 className='p-2 font-medium text-xl h-12 border-b'>Summarium</h2>
        <SidebarGroup className='py-0'>
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
