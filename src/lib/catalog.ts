export interface CatalogCard { id: string; player: string; club: string; season: string; manufacturer: string; collection: string; number: string; image: string }
export interface CardVariant { id: string; cardId: string; parallel: string; printRun: number | null; autograph: boolean }
export interface PhysicalCopy { id: string; variantId: string; ownerId: string; serial: string; condition: string; grading: string; front: string; back: string; price: number | null; listed: boolean; createdAt: string }
export interface Collector { id: string; name: string; handle: string; city: string }
export const collectors: Collector[] = [{id:'me',name:'Lucas Ferreira',handle:'lucas.cards',city:'São Paulo, SP'},{id:'rafa',name:'Rafael Costa',handle:'rafa.collector',city:'Curitiba, PR'},{id:'ana',name:'Ana Martins',handle:'ana.cards',city:'Belo Horizonte, MG'}];
export const catalogCards: CatalogCard[] = [
  {id:'vini',player:'Vinícius Júnior',club:'Real Madrid',season:'2023/24',manufacturer:'Topps',collection:'Topps Chrome UEFA',number:'#10',image:'/demo-cards/card-1.jpg'},
  {id:'pele',player:'Pelé',club:'Seleção Brasileira',season:'2022',manufacturer:'Panini',collection:'Panini Prizm World Cup',number:'#25',image:'/demo-cards/card-2.jpg'},
  {id:'messi',player:'Lionel Messi',club:'Seleção Argentina',season:'2022',manufacturer:'Panini',collection:'Panini Prizm World Cup',number:'#1',image:'/demo-cards/card-3.jpg'},
  {id:'cr7',player:'Cristiano Ronaldo',club:'Manchester United',season:'2022/23',manufacturer:'Panini',collection:'Panini Select',number:'#7',image:'/demo-cards/card-4.jpg'},
  {id:'ney',player:'Neymar Jr.',club:'Paris Saint-Germain',season:'2022/23',manufacturer:'Topps',collection:'Topps Chrome UEFA',number:'#11',image:'/demo-cards/card-5.jpg'},
  {id:'endrick',player:'Endrick',club:'Palmeiras',season:'2023',manufacturer:'Panini',collection:'Panini Select',number:'#9',image:'/demo-cards/card-6.jpg'},
];
export const variants: CardVariant[] = [
  {id:'vini-gold',cardId:'vini',parallel:'Gold',printRun:50,autograph:false},
  {id:'vini-base',cardId:'vini',parallel:'Base',printRun:null,autograph:false},
  {id:'pele-green',cardId:'pele',parallel:'Green',printRun:99,autograph:true},
  {id:'messi-silver',cardId:'messi',parallel:'Silver',printRun:null,autograph:false},
  {id:'cr7-red',cardId:'cr7',parallel:'Red',printRun:199,autograph:false},
  {id:'ney-blue',cardId:'ney',parallel:'Blue',printRun:150,autograph:true},
  {id:'endrick-base',cardId:'endrick',parallel:'Base',printRun:null,autograph:false},
];
export const initialCopies: PhysicalCopy[] = [
  {id:'copy-1',variantId:'vini-gold',ownerId:'rafa',serial:'17/50',condition:'Near Mint',grading:'PSA 10',front:'/demo-cards/card-1.jpg',back:'',price:1250,listed:true,createdAt:'2026-10-07T12:00:00Z'},
  {id:'copy-2',variantId:'pele-green',ownerId:'ana',serial:'32/99',condition:'Mint',grading:'Sem graduação',front:'/demo-cards/card-2.jpg',back:'',price:890,listed:true,createdAt:'2026-10-07T11:00:00Z'},
  {id:'copy-3',variantId:'messi-silver',ownerId:'rafa',serial:'',condition:'Mint',grading:'PSA 9',front:'/demo-cards/card-3.jpg',back:'',price:480,listed:true,createdAt:'2026-10-07T10:00:00Z'},
  {id:'copy-4',variantId:'cr7-red',ownerId:'ana',serial:'87/199',condition:'Near Mint',grading:'BGS 9.5',front:'/demo-cards/card-4.jpg',back:'',price:620,listed:true,createdAt:'2026-10-06T09:00:00Z'},
  {id:'copy-5',variantId:'ney-blue',ownerId:'rafa',serial:'08/150',condition:'Mint',grading:'Sem graduação',front:'/demo-cards/card-5.jpg',back:'',price:750,listed:true,createdAt:'2026-10-06T08:00:00Z'},
  {id:'own-1',variantId:'endrick-base',ownerId:'me',serial:'',condition:'Mint',grading:'Sem graduação',front:'/demo-cards/card-6.jpg',back:'',price:null,listed:false,createdAt:'2026-10-05T08:00:00Z'},
  {id:'own-2',variantId:'endrick-base',ownerId:'me',serial:'',condition:'Near Mint',grading:'Sem graduação',front:'/demo-cards/card-6.jpg',back:'',price:null,listed:false,createdAt:'2026-10-04T08:00:00Z'},
  {id:'own-3',variantId:'vini-base',ownerId:'me',serial:'',condition:'Mint',grading:'Sem graduação',front:'/demo-cards/card-1.jpg',back:'',price:null,listed:false,createdAt:'2026-10-03T08:00:00Z'},
];
export const variantLabel = (variant: CardVariant) => `${variant.parallel}${variant.printRun ? ` /${variant.printRun}` : ''}`;
export const money = (value: number) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value);
export const getCard = (variant: CardVariant) => catalogCards.find(card=>card.id===variant.cardId);
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const matchesText = (variant: CardVariant, query: string) => { const card=getCard(variant); return card ? normalize(`${card.player} ${card.club} ${card.collection} ${card.season} ${variant.parallel}`).includes(normalize(query)) : false; };