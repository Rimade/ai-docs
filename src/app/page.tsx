import Link from 'next/link';

export default function Home() {
	return (
		<div className="min-h-screen flex items-center justify-center text-3xl">
			Click{' '}
			<Link href="/documents/123">
				<span className="text-blue-500 underline">&nbsp;here&nbsp;</span>
			</Link>{' '}
			to go
		</div>
	);
}
