import Link from 'next/link';
import Image from 'next/image';
import { SearchInput } from '../../search-input';
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/shared/ui/tooltip';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center h-full w-full px-4 md:px-8">
      <Link href="/" className="flex gap-2 items-center shrink-0 pr-6">
        <Image src="/icons/logo.png" alt="AI Docs" width={36} height={36} />
        <h3 className="text-xl font-normal">Документы</h3>
      </Link>
      <SearchInput />
      <div className="flex gap-3 items-center shrink-0 pl-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/"
                afterLeaveOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                afterSelectPersonalUrl="/"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Переключить организацию</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <UserButton />
            </TooltipTrigger>
            <TooltipContent>
              <p>Профиль пользователя</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </nav>
  );
}
