import Link from 'next/link';
import Image from 'next/image';
import SearchInput from './search-input';
import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
	return (
		<nav className="flex justify-between items-center h-full w-full">
			<Link href="/" className="flex gap-2 items-center shrink-0 pr-6">
				<Image src="/icons/logo.png" alt="Lazy Docs" width={36} height={36} />
				<h3 className="text-xl font-normal">Документы</h3>
			</Link>
			<SearchInput />
			<div className="flex gap-3 items-center shrink-0">
				<UserButton />
			</div>
		</nav>
	);
}
