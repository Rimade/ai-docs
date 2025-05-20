'use client';

import { useRef, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { useSearchParam } from '@/shared/hooks/use-search-param';

export default function SearchInput() {
  const [value, setValue] = useSearchParam();
  const [search, setSearch] = useState(value);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValue(search);
    inputRef.current?.blur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleReset = () => {
    setSearch('');
    setValue('');
    inputRef.current?.blur();
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <form className="relative max-w-[720px] w-full" onSubmit={handleSubmit}>
        <Input
          className="md:text-base text-sm placeholder:text-neutral-800 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)]
          bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus-visible:bg-white"
          placeholder="Поиск"
          value={search}
          onChange={handleChange}
          ref={inputRef}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 [&_svg]:size-5 rounded-full"
        >
          <SearchIcon className="size-5" />
        </Button>

        {search && (
          <Button
            onClick={handleReset}
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 [&_svg]:size-5 rounded-full"
          >
            <XIcon className="size-5" />
          </Button>
        )}
      </form>
    </div>
  );
}
