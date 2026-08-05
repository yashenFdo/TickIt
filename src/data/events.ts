export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: string;
  rating: string;
  matchPercentage: number;
  ageRating: string;
  backdropUrl: string;
  posterUrl: string;
  description: string;
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isLive?: boolean;
  ticketsRemaining: number;
  performers: string[];
  vipPerks?: string[];
}

export const FEATURED_EVENT: EventItem = {
  id: 'feat-1',
  title: 'MONACO GRAND PRIX: ROYAL PADDOCK CLUB',
  subtitle: 'Exclusive Superyacht & Private Suite Access',
  category: 'Formula 1 & Motorsport Gala',
  date: 'SAT, MAY 23, 2026',
  time: '11:00 AM CET',
  venue: 'Circuit de Monaco Paddock',
  location: 'Monte Carlo, Monaco',
  price: '$12,500',
  rating: '5.0 ★',
  matchPercentage: 99,
  ageRating: 'VIP 21+',
  backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
  posterUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop',
  description: 'Ultra-exclusive access to the Formula 1 Monaco Grand Prix Royal Suite, gourmet Michelin-star dining, pit-lane walks, champagne lounge, and luxury superyacht viewing.',
  tags: ['F1 Paddock', 'Superyacht', 'Michelin Dining', 'Chauffeur Included'],
  isFeatured: true,
  ticketsRemaining: 3,
  performers: ['Scuderia Ferrari Drivers', 'Red Bull Racing VIP', 'Guest DJs'],
  vipPerks: ['Private Helicopter Transfer', 'Michelin 3-Star Tasting Menu', '24/7 Dedicated Concierge'],
};

export const EVENT_CATEGORIES = [
  { id: 'all', name: 'All VIP Events' },
  { id: 'gala', name: 'Royal Galas & Opera' },
  { id: 'motorsport', name: 'Formula 1 & Luxury Sport' },
  { id: 'concerts', name: 'Private Orchestras' },
  { id: 'fashion', name: 'Fashion Week & Afterparties' },
  { id: 'summit', name: 'Executive Summits' },
];

export const EVENTS_BY_CATEGORY: Record<string, EventItem[]> = {
  'Exclusive VIP Collections': [
    {
      id: 'tr-1',
      title: 'ROYAL ALBERT HALL: PRIVATE ROYAL BOX',
      subtitle: 'Private Philharmonic Evening with Dinner',
      category: 'Orchestra & Opera',
      date: 'AUG 22, 2026',
      time: '7:30 PM',
      venue: 'Royal Albert Hall',
      location: 'London, UK',
      price: '$4,800',
      rating: '5.0 ★',
      matchPercentage: 99,
      ageRating: 'VIP',
      backdropUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop',
      description: 'Exclusive 12-person Royal Box reservation with private champagne lounge and butler service.',
      tags: ['Royal Box', 'Private Butler', 'Philharmonic'],
      isTrending: true,
      ticketsRemaining: 2,
      performers: ['London Symphony Orchestra', 'Andrea Bocelli'],
      vipPerks: ['Private Entrance', 'Champagne Butler', 'Pre-Show Tasting'],
    },
    {
      id: 'tr-2',
      title: 'CANNES FILM FESTIVAL: AMFAR ROYAL GALA',
      subtitle: 'Charity Auction & Celebrity Afterparty',
      category: 'Gala',
      date: 'SEP 04, 2026',
      time: '8:00 PM',
      venue: 'Hôtel du Cap-Eden-Roc',
      location: 'Cannes, France',
      price: '$18,000',
      rating: '5.0 ★',
      matchPercentage: 98,
      ageRating: 'VIP 21+',
      backdropUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
      description: 'Join A-list celebrities and global leaders at the world’s most prestigious red carpet gala.',
      tags: ['Red Carpet', 'Cannes', 'A-List VIP'],
      isTrending: true,
      ticketsRemaining: 1,
      performers: ['Dua Lipa', 'Lenny Kravitz'],
      vipPerks: ['Red Carpet Arrival', 'Luxury Chauffeur', 'Afterparty Pass'],
    },
    {
      id: 'tr-3',
      title: 'MET GALA: EXCLUSIVE VIP AFTERPARTY',
      subtitle: 'Private Mansion Event in Manhattan',
      category: 'Fashion Week',
      date: 'SEP 18, 2026',
      time: '11:00 PM',
      venue: 'The Carlyle Hotel',
      location: 'New York, NY',
      price: '$9,500',
      rating: '4.9 ★',
      matchPercentage: 97,
      ageRating: 'VIP 21+',
      backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1527269534026-c86f549ba54f?q=80&w=600&auto=format&fit=crop',
      description: 'Ultra-exclusive private afterparty for fashion icons, designers, and Hollywood royalty.',
      tags: ['Manhattan VIP', 'Fashion Royalty', 'Open Bar'],
      isTrending: true,
      ticketsRemaining: 4,
      performers: ['Surprise A-List Artists'],
      vipPerks: ['Private Table', 'Personal Concierge'],
    },
    {
      id: 'tr-4',
      title: 'ASPEN WINTER JAZZ: PRESIDENTIAL SUITE',
      subtitle: 'Intimate Fireside Concert & Dinner',
      category: 'Concert',
      date: 'OCT 10, 2026',
      time: '6:30 PM',
      venue: 'The Little Nell',
      location: 'Aspen, Colorado',
      price: '$6,200',
      rating: '5.0 ★',
      matchPercentage: 99,
      ageRating: 'VIP',
      backdropUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1540539233-667454238a91?q=80&w=600&auto=format&fit=crop',
      description: 'Fireside jazz masterclasses, vintage wine pairing, and private chalet hospitality.',
      tags: ['Fireside Jazz', 'Vintage Wine', 'Aspen Chalet'],
      isTrending: true,
      ticketsRemaining: 5,
      performers: ['Wynton Marsalis Trio'],
      vipPerks: ['Private Chalet Lounge', 'Rare Wine Cellar Access'],
    },
  ],

  'Live Tonight & Royal Lounges': [
    {
      id: 'lf-1',
      title: 'VIENNA PHILHARMONIC: PRIVATE OPERA BOX',
      subtitle: 'The Golden Hall Gala Evening',
      category: 'Orchestra',
      date: 'TONIGHT',
      time: '7:30 PM',
      venue: 'Musikverein Golden Hall',
      location: 'Vienna, Austria',
      price: '$3,900',
      rating: '5.0 ★',
      matchPercentage: 99,
      ageRating: 'VIP',
      backdropUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=600&auto=format&fit=crop',
      description: 'Private Royal Box seated reservation with champagne reception and private maestro greeting.',
      tags: ['Golden Hall', 'Vienna', 'Private Box'],
      isLive: true,
      ticketsRemaining: 2,
      performers: ['Vienna Philharmonic Strings'],
      vipPerks: ['Maestro Meet & Greet', 'Private Box Service'],
    },
    {
      id: 'lf-2',
      title: 'SUPER BOWL LXI: CHAIRMAN EXECUTIVE SUITE',
      subtitle: 'All-Inclusive Luxury Suite & Field Access',
      category: 'Sports',
      date: 'TONIGHT',
      time: '6:00 PM',
      venue: 'SoFi Stadium',
      location: 'Los Angeles, CA',
      price: '$25,000',
      rating: '5.0 ★',
      matchPercentage: 99,
      ageRating: 'VIP',
      backdropUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=600&auto=format&fit=crop',
      description: '50-yard line private luxury suite with personal executive chef and field-level passes.',
      tags: ['Super Bowl Suite', 'Field Access', 'Executive Chef'],
      isLive: true,
      ticketsRemaining: 1,
      performers: ['NFL Champions & Halftime Performers'],
      vipPerks: ['Field Level Credentials', 'Private Chauffeur Fleet'],
    },
  ],
};
