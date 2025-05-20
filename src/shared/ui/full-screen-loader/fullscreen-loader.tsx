import { LoaderIcon } from 'lucide-react';

interface FullscreenLoaderProps {
	label?: string;
}

export const FullscreenLoader = ({ label }: FullscreenLoaderProps) => {
	return (
		<div className="flex flex-col min-h-screen items-center justify-center gap-2">
			<LoaderIcon className="size-6 text-muted-foreground animate-spin" />
			{label && <p className="text-sm text-muted-foreground">{label}</p>}
		</div>
	);
};
