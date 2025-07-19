'use client';

import React from 'react';
import Link from 'next/link';
import {Bell} from 'lucide-react';
import {Truck} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {Button} from "@/components/ui/button";

export const Header: React.FC = () => {
  return (
    <div className="w-full bg-background text-foreground py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center text-lg font-bold">
        {/* Truck Icon (Inline SVG) */}
        <svg
          width="40"
          height="32"
          viewBox="0 0 40 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 text-orange-500"
        >
          <path
            d="M7.5 12C6.675 12 6 12.675 6 13.5V26C6 26.825 6.675 27.5 7.5 27.5H32.5C33.325 27.5 34 26.825 34 26V13.5C34 12.675 33.325 12 32.5 12H7.5ZM7.5 14H32.5V20H7.5V14ZM7.5 21.5H32.5V26H7.5V21.5ZM10.625 30C11.45 30 12.125 29.325 12.125 28.5C12.125 27.675 11.45 27 10.625 27C9.8 27 9.125 27.675 9.125 28.5C9.125 29.325 9.8 30 10.625 30ZM29.375 30C30.2 30 30.875 29.325 30.875 28.5C30.875 27.675 30.2 27 29.375 27C28.55 27 27.875 27.675 27.875 28.5C27.875 29.325 28.55 30 29.375 30ZM35 7.75C35 6.925 34.325 6.25 33.5 6.25H25.8375L23.9375 2.5H16.0625L14.1625 6.25H6.5C5.675 6.25 5 6.925 5 7.75V10.5C5 11.325 5.675 12 6.5 12H33.5C34.325 12 35 11.325 35 10.5V7.75ZM6.5 7.75H14.8125L16.3125 4.25H23.6875L25.1875 7.75H33.5V10.5H6.5V7.75Z"
            fill="currentColor"
          />
        </svg>
        {/* Vertical Separator Line */}
        <div className="h-8 border-l border-teal-500 mx-2"></div>
        {/* PathX Text in a Box */}
        <div className=" text-white  px-2 py-1 rounded-md">
          PATHX
        </div>
      </Link>

      {/* Navigation Links */}
      <div className=" flex space-x-4">
        <Link href="#" className="hover:text-primary">Services</Link>
        <Link href="#" className="hover:text-primary">Solutions</Link>
        <Link href="/blog" className="hover:text-primary">Blog</Link>
        <Link href="#" className="hover:text-primary">Company</Link>
        <Link href="#" className="hover:text-primary">Support</Link>
      </div>
       {/* Notification Icon */}
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">View notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

