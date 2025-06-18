import Link from 'next/link';
import { LogoIcon } from '@/components/icons/logo-icon';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <LogoIcon className="h-8 w-8" /> {/* Adjusted size slightly for better visibility of new logo */}
          <span className="font-bold font-headline sm:inline-block text-lg">
            Quintech
          </span>
        </Link>
        {/* Add navigation items here if needed later */}
      </div>
    </header>
  );
}
