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
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
            fillOpacity="0.3"
        />
        <path
            d="M12 4c-2.21 0-4.21.9-5.66 2.34-.38.38-.38 1.02 0 1.41.38.38 1.02.38 1.41 0C8.79 6.7 10.3 6 12 6s3.21.7 4.24 1.76c.38.38 1.02.38 1.41 0s.38-1.02 0-1.41C16.21 4.9 14.21 4 12 4zm0 14c2.21 0 4.21-.9 5.66-2.34.38-.38.38-1.02 0-1.41s-1.02-.38-1.41 0C15.21 15.3 13.7 16 12 16s-3.21-.7-4.24-1.76c-.38-.38-1.02-.38-1.41 0s-.38 1.02 0 1.41C7.79 17.1 9.79 18 12 18zm-7-6h14v-2H5v2z"
            fill="currentColor"
        />
    </svg>
  );
}
