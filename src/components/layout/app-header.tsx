import Link from 'next/link';
import Image from 'next/image';
import { LogoIcon } from '@/components/icons/logo-icon';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <LogoIcon className="h-8 w-8" />
          <span className="font-bold font-headline sm:inline-block text-lg">
            Quintech
          </span>
        </Link>
        
        <div className="flex-1 flex justify-center">
          <Image
            src="https://placehold.co/100x40.png" 
            alt="SAP Logo"
            width={100}
            height={40}
            data-ai-hint="SAP logo"
          />
        </div>

        {/* Placeholder for right-side elements like nav or user profile */}
        <div className="w-auto min-w-[150px] flex justify-end"> {/* Adjust min-width as needed or remove if not balancing */}
           {/* Future navigation items or user profile can go here */}
        </div>
      </div>
    </header>
  );
}
