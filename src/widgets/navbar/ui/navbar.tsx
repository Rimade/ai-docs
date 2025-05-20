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
        <Image src="/icons/logo.png" alt="AI Word" width={36} height={36} />
        <h3 className="text-xl font-normal hidden md:block">AI Word</h3>
      </Link>
      <SearchInput />
      <div className="flex gap-3 items-center shrink-0 pl-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationSwitcherTrigger: 'text-xl',
                    organizationPreview: 'md:flex',
                    organizationSwitcherTriggerIcon: 'block',
                    organizationSwitcherTriggerOrganizationName: 'md:block',
                    organizationSwitcherPopoverCard: 'w-full sm:w-auto',
                    organizationPreviewTextContainer: 'hidden md:flex',
                    organizationSwitcherPopoverActionButton: 'w-full sm:w-auto',
                    organizationSwitcherPopoverActionButtonText: 'block',
                    organizationSwitcherPopoverActionButtonIcon: 'hidden sm:block'
                  }
                }}
                afterCreateOrganizationUrl="/"
                afterLeaveOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                afterSelectPersonalUrl="/"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Change organization</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <UserButton />
            </TooltipTrigger>
            <TooltipContent>
              <p>User&apos;s profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </nav>
  );
}
