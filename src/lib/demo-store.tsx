import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initialCopies, getCard, type PhysicalCopy, type CardVariant } from './catalog';

interface DemoState { copies: PhysicalCopy[]; wanted: string[]; toggleHave: (variant: CardVariant) => void; toggleWant: (id: string) => void; addListing: (copy: PhysicalCopy) => void; reset: () => void }
const DemoContext = createContext<DemoState | null>(null);
const storageKey = 'football-cards-demo-v1';
export function DemoProvider({children}:{children:ReactNode}) {
 const [copies,setCopies]=useState<PhysicalCopy[]>(initialCopies);
 const [wanted,setWanted]=useState<string[]>(['vini-gold','messi-silver']);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try { const raw=sessionStorage.getItem(storageKey); if(raw){const data=JSON.parse(raw); if(Array.isArray(data.copies)&&Array.isArray(data.wanted)){setCopies(data.copies);setWanted(data.wanted);}} }catch { /* Demo storage may be unavailable. */ } setReady(true);},[]);
 useEffect(()=>{if(ready){try {sessionStorage.setItem(storageKey,JSON.stringify({copies,wanted}));}catch { /* Uploaded photos can exceed the local session quota. */ }}},[copies,wanted,ready]);
 const toggleHave=(variant:CardVariant)=>setCopies(prev=>prev.some(c=>c.ownerId==='me'&&c.variantId===variant.id)?prev.filter(c=>!(c.ownerId==='me'&&c.variantId===variant.id)):[...prev,{id:crypto.randomUUID(),variantId:variant.id,ownerId:'me',serial:'',condition:'Não informada',grading:'Sem graduação',front:getCard(variant)?.image??'',back:'',price:null,listed:false,createdAt:new Date().toISOString()}]);
 return <DemoContext.Provider value={{copies,wanted,toggleHave,toggleWant:id=>setWanted(prev=>prev.includes(id)?prev.filter(v=>v!==id):[...prev,id]),addListing:copy=>setCopies(prev=>[copy,...prev]),reset:()=>{setCopies(initialCopies);setWanted(['vini-gold','messi-silver']);}}}>{children}</DemoContext.Provider>;
}
export function useDemo(){const context=useContext(DemoContext);if(!context)throw new Error('DemoProvider is required');return context;}