import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-8", className)}
        {...props}
        >
        <path 
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
            fill="currentColor" 
            fillOpacity="0.1" 
        />
        <path 
            d="M15.5 5.5C14.28 4.53 12.76 4 11 4C6.58 4 3 7.58 3 12C3 13.76 3.53 15.28 4.5 16.5L15.5 5.5Z" 
            fill="currentColor" 
            fillOpacity="0.5"
        />
        <path 
            d="M19.5 7.5C20.47 8.72 21 10.24 21 12C21 16.42 17.42 20 13 20C11.24 20 9.72 19.47 8.5 18.5L19.5 7.5Z" 
            fill="currentColor" 
        />
        <circle cx="12" cy="12" r="3" fill="white" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" fillOpacity="0.6"/>
    </svg>
  );
}
