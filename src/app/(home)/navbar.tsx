import Link from 'next/link';
import Image from 'next/image';
import SearchInput from './search-input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function Navbar() {
	return (
		<nav className="flex justify-between items-center h-full w-full">
			<Link href="/" className="flex gap-2 items-center shrink-0 pr-6">
				<Image src="/icon.ico" alt="Lazy Docs" width={36} height={36} />
				<h3 className="text-xl font-normal">Документы</h3>
			</Link>
			<SearchInput />
			<div className="flex gap-3 items-center shrink-0 pr-6">
				<Button>
					<PlusIcon className="w-4 h-4" />
				</Button>
			</div>
		</nav>
	);
}
