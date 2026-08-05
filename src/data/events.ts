export interface Speaker {
  name: string;
  role: string;
  avatar: string;
}

export interface Sponsor {
  name: string;
  tier: string;
}

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
  fullDescription?: string;
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isLive?: boolean;
  ticketsRemaining: number;
  performers: string[];
  speakers?: Speaker[];
  sponsors?: Sponsor[];
  vipPerks?: string[];
}

export const FEATURED_EVENT: EventItem = {
  id: 'feat-1',
  title: 'GLOBAL TECH & AI INNOVATION SUMMIT 2026',
  subtitle: 'The Future of Neural Intelligence, Robotics & Quantum Computing',
  category: 'Tech & AI Summit',
  date: 'SAT, AUG 22, 2026',
  time: '09:00 AM PST',
  venue: 'Moscone Center Grand Ballroom',
  location: 'San Francisco, CA',
  price: '$299',
  rating: '4.9 ★',
  matchPercentage: 98,
  ageRating: 'All Ages',
  backdropUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
  posterUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
  description: 'Join world-leading AI researchers, tech founders, and industry visionaries for a transformative 2-day conference on Generative AI, Autonomous Systems, and Quantum Computing.',
  fullDescription: 'The Global Tech & AI Innovation Summit 2026 brings together over 5,000 technology leaders, AI engineers, and venture capitalists. Experience live keynote addresses, hands-on developer workshops, interactive robotics demonstrations, and high-impact networking sessions with industry founders.',
  tags: ['Artificial Intelligence', 'Keynote', 'Robotics', 'Networking'],
  isFeatured: true,
  ticketsRemaining: 14,
  performers: ['Dr. Aris Thorne', 'Elena Vance', 'Marcus Sterling'],
  speakers: [
    {
      name: 'Dr. Aris Thorne',
      role: 'Chief Scientist, DeepMind AI Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Elena Vance',
      role: 'VP of Quantum Hardware, Neural Core',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Marcus Sterling',
      role: 'Founder & CEO, Sterling Robotics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
  ],
  sponsors: [
    { name: 'Google Cloud', tier: 'Title Partner' },
    { name: 'NVIDIA AI', tier: 'Keynote Sponsor' },
    { name: 'OpenAI Labs', tier: 'Technology Partner' },
    { name: 'Microsoft Azure', tier: 'Executive Sponsor' },
  ],
  vipPerks: ['Private VIP Lounge Access', '1-on-1 Speaker Networking Dinner', 'Exclusive Keynote Recording Pass'],
};

export const EVENT_CATEGORIES = [
  { id: 'all', name: 'All Events' },
  { id: 'tech', name: 'Tech & AI' },
  { id: 'concerts', name: 'Live Music' },
  { id: 'comedy', name: 'Comedy & Standup' },
  { id: 'sports', name: 'Sports & Gaming' },
];

export const EVENTS_BY_CATEGORY: Record<string, EventItem[]> = {
  'Trending Now': [
    {
      id: 'tr-1',
      title: 'SYNTHWAVE NEON NIGHTS LIVE',
      subtitle: 'Immersive Spatial Audio Concert',
      category: 'Live Music',
      date: 'AUG 15, 2026',
      time: '8:00 PM',
      venue: 'The Wiltern Theatre',
      location: 'Los Angeles, CA',
      price: '$95',
      rating: '4.8 ★',
      matchPercentage: 96,
      ageRating: '18+',
      backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
      description: 'Experience a electrifying synthwave performance with 3D holographic visuals and laser pyrotechnics.',
      fullDescription: 'Synthwave Neon Nights Live is an immersive audiovisual electronic music concert featuring top synthwave producers and live multi-instrumentalists.',
      tags: ['Electronic', 'Holographic', 'Live Synth'],
      isTrending: true,
      ticketsRemaining: 8,
      performers: ['Kavinsky Crew', 'CyberDream Band'],
      speakers: [
        {
          name: 'Kavinsky',
          role: 'Headline Electronic Producer',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        },
      ],
      sponsors: [
        { name: 'Spotify Music', tier: 'Media Partner' },
        { name: 'Bose Audio', tier: 'Sound Sponsor' },
      ],
    },
    {
      id: 'tr-2',
      title: 'STANDUP WORLD COMEDY ALL-STARS',
      subtitle: 'Uncensored Comedy Special Live Recording',
      category: 'Standup',
      date: 'AUG 28, 2026',
      time: '9:30 PM',
      venue: 'Comedy Cellar Village',
      location: 'New York, NY',
      price: '$65',
      rating: '4.9 ★',
      matchPercentage: 94,
      ageRating: '21+',
      backdropUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1200&auto=format&fit=crop',
      posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
      description: 'An unforgettable night of non-stop laughter featuring top Netflix standup comedians live on stage.',
      fullDescription: 'Join five of the funniest touring standup comedians for a live 2-hour uncensored comedy taping.',
      tags: ['Standup', 'Netflix Comedy', 'Live Taping'],
      isTrending: true,
      ticketsRemaining: 5,
      performers: ['Dave Jenkins', 'Sarah Silverman Special Guests'],
      speakers: [
        {
          name: 'Dave Jenkins',
          role: 'Host & Headline Comedian',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        },
      ],
      sponsors: [
        { name: 'Heineken', tier: 'Official Beverage Partner' },
      ],
    },
  ],
};
