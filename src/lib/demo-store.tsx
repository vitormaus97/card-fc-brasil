import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initialCopies, type PhysicalCopy } from "./catalog";

interface DemoState {
  copies: PhysicalCopy[];
  addListing: (copy: PhysicalCopy) => void;
  reset: () => void;
}
const DemoContext = createContext<DemoState | null>(null);
const storageKey = "football-cards-demo-v1";
export function DemoProvider({ children }: { children: ReactNode }) {
  const [copies, setCopies] = useState<PhysicalCopy[]>(initialCopies);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.copies)) {
          setCopies(data.copies);
        }
      }
    } catch {
      /* Demo storage may be unavailable. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({ copies }));
      } catch {
        /* Uploaded photos can exceed the local session quota. */
      }
    }
  }, [copies, ready]);
  return (
    <DemoContext.Provider
      value={{
        copies,
        addListing: (copy) => setCopies((prev) => [copy, ...prev]),
        reset: () => {
          setCopies(initialCopies);
        },
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider is required");
  return context;
}
