'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Don't show navbar on home page ("/") or login page ("/login")
  if (pathname === '/' || pathname === '/login') {
    return null;
  }
  
  return <Navbar />;
};

export default ConditionalNavbar;
