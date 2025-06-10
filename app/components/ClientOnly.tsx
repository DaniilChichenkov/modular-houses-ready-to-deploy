import { useEffect, useState, ReactNode } from "react";

const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return isMounted ? <>{children}</> : null;
};

export default ClientOnly;
