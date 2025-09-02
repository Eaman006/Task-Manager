'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

const PROTECTED_PREFIXES = ['/home', '/task'];

const ClientGuard = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isProtected && !loading && !user) {
      router.replace('/login');
    }
  }, [isProtected, loading, user, router]);

  if (!mounted) {
    return null;
  }

  if (isProtected && (loading || !user)) {
    return null;
  }

  return children;
};

export default ClientGuard;


