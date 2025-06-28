export interface StreamingService {
  id: string;
  name: string;
  logo: string;
  description: string;
  tagline: string;
  primaryColor: string;
  features: Feature[];
  pricingPlans: PricingPlan[];
  reviews: Review[];
  stats: ServiceStats;
  urgencyMessage: string;
  valueProposition: string[];
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  features: string[];
  popular?: boolean;
  savings?: string;
  urgency?: string;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ServiceStats {
  totalUsers: string;
  contentHours: string;
  countries: number;
  rating: number;
  satisfaction: string;
}

const ACCENT_COLOR = 'rgb(54, 235, 138)';

export const streamingServices: Record<string, StreamingService> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    logo: '/placeholder.svg?height=40&width=120',
    description:
      'Get instant access to unlimited movies, TV shows, and documentaries on any device.',
    tagline: 'Entertainment without limits',
    primaryColor: ACCENT_COLOR,
    urgencyMessage: '🔥 Limited time: Save 30% on your first 3 months!',
    valueProposition: [
      'No ads, no interruptions',
      'Download and watch offline',
      'Cancel anytime, no contracts',
      '4K Ultra HD available',
    ],
    features: [
      {
        icon: '🎬',
        title: 'Exclusive Originals',
        description:
          "Award-winning Netflix Originals you can't find anywhere else",
      },
      {
        icon: '📱',
        title: 'Watch Anywhere',
        description:
          'Stream on TV, laptop, phone, and tablet with seamless sync',
      },
      {
        icon: '👨‍👩‍👧‍👦',
        title: 'Family Profiles',
        description: 'Up to 5 personalized profiles with parental controls',
      },
      {
        icon: '⬇️',
        title: 'Offline Viewing',
        description: 'Download unlimited titles to watch without internet',
      },
    ],
    pricingPlans: [
      {
        name: 'Essential',
        price: 6.99,
        originalPrice: 8.99,
        period: 'month',
        savings: 'Save $24/year',
        features: [
          '1 screen',
          'HD quality',
          'Unlimited content',
          'Mobile downloads',
        ],
      },
      {
        name: 'Standard',
        price: 10.99,
        originalPrice: 13.99,
        period: 'month',
        savings: 'Save $36/year',
        features: [
          '2 screens',
          'Full HD quality',
          'Unlimited content',
          'All device downloads',
        ],
        popular: true,
        urgency: 'Most popular choice',
      },
      {
        name: 'Premium',
        price: 14.99,
        originalPrice: 17.99,
        period: 'month',
        savings: 'Save $48/year',
        features: [
          '4 screens',
          '4K Ultra HD',
          'Unlimited content',
          'Premium audio',
        ],
      },
    ],
    reviews: [
      {
        id: '1',
        user: 'Sarah Johnson',
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 5,
        comment:
          'Best investment for entertainment! The original content is incredible and the streaming quality is flawless.',
        date: '2024-01-15',
        verified: true,
      },
      {
        id: '2',
        user: 'Mike Chen',
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 5,
        comment:
          "Worth every penny. My family uses it daily and we've discovered so many great shows.",
        date: '2024-01-10',
        verified: true,
      },
      {
        id: '3',
        user: 'Emily Davis',
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 4,
        comment:
          'Great value for money. The kids profiles keep everyone happy and content is always fresh.',
        date: '2024-01-08',
        verified: true,
      },
    ],
    stats: {
      totalUsers: '230M+',
      contentHours: '15,000+',
      countries: 190,
      rating: 4.8,
      satisfaction: '96%',
    },
  },
  'prime-video': {
    id: 'prime-video',
    name: 'Prime Video',
    logo: '/placeholder.svg?height=40&width=120',
    description:
      'Stream thousands of movies and TV shows plus get all Prime benefits.',
    tagline: 'More than streaming',
    primaryColor: ACCENT_COLOR,
    urgencyMessage: '🚀 Special offer: Get 2 months free with annual plan!',
    valueProposition: [
      'Free shipping on millions of items',
      'Prime Music included',
      'Exclusive Prime Day deals',
      'Prime Reading access',
    ],
    features: [
      {
        icon: '🎭',
        title: 'Prime Originals',
        description:
          'Exclusive Amazon Original series and award-winning movies',
      },
      {
        icon: '📦',
        title: 'Prime Benefits',
        description:
          'Free shipping, music, reading, and exclusive deals included',
      },
      {
        icon: '🎬',
        title: 'Latest Releases',
        description: 'Rent or buy the newest movies and TV shows',
      },
      {
        icon: '🌍',
        title: 'Global Content',
        description: 'International movies and shows from around the world',
      },
    ],
    pricingPlans: [
      {
        name: 'Video Only',
        price: 8.99,
        period: 'month',
        features: [
          'Unlimited streaming',
          'Prime Video Originals',
          'HD quality',
          'Mobile downloads',
        ],
      },
      {
        name: 'Prime Monthly',
        price: 14.99,
        period: 'month',
        features: [
          'All Prime Video content',
          'Free 2-day shipping',
          'Prime Music',
          'Prime Reading',
        ],
        popular: true,
        urgency: 'Best value',
      },
      {
        name: 'Prime Annual',
        price: 139,
        originalPrice: 179.88,
        period: 'year',
        savings: 'Save $40.88',
        features: [
          'All Prime benefits',
          'Free shipping',
          'Exclusive deals',
          'Prime Day access',
        ],
      },
    ],
    reviews: [
      {
        id: '1',
        user: 'David Wilson',
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 5,
        comment:
          'Incredible value! The shipping alone pays for itself, and the video content is top-notch.',
        date: '2024-01-12',
        verified: true,
      },
      {
        id: '2',
        user: 'Lisa Rodriguez',
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 4,
        comment:
          'Love the convenience of having everything in one membership. Great original shows too!',
        date: '2024-01-09',
        verified: true,
      },
    ],
    stats: {
      totalUsers: '200M+',
      contentHours: '12,000+',
      countries: 240,
      rating: 4.6,
      satisfaction: '94%',
    },
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    logo: '/placeholder.svg?height=40&width=120',
    description:
      'Access millions of songs and podcasts with personalized playlists and high-quality audio.',
    tagline: 'Music for every moment',
    primaryColor: ACCENT_COLOR,
    urgencyMessage: '🎵 Limited time: Get 3 months for the price of 1!',
    valueProposition: [
      '70+ million songs ad-free',
      'Offline downloads',
      'High-quality audio',
      'Personalized playlists',
    ],
    features: [
      {
        icon: '🎵',
        title: 'Unlimited Music',
        description: 'Access to over 70 million songs and 4 million podcasts',
      },
      {
        icon: '🎯',
        title: 'Smart Recommendations',
        description: 'AI-powered Discover Weekly and Daily Mix playlists',
      },
      {
        icon: '📱',
        title: 'Seamless Experience',
        description: 'Listen across all your devices with perfect sync',
      },
      {
        icon: '👥',
        title: 'Social Features',
        description: 'Share music and see what friends are listening to',
      },
    ],
    pricingPlans: [
      {
        name: 'Individual',
        price: 10.99,
        period: 'month',
        features: [
          'Ad-free music',
          'Download music',
          'Unlimited skips',
          'High audio quality',
        ],
        popular: true,
        urgency: 'Most popular',
      },
      {
        name: 'Duo',
        price: 14.99,
        period: 'month',
        features: [
          '2 Premium accounts',
          'Duo Mix playlist',
          'Ad-free music',
          'Download music',
        ],
      },
      {
        name: 'Family',
        price: 16.99,
        originalPrice: 21.99,
        period: 'month',
        savings: 'Save $60/year',
        features: [
          '6 Premium accounts',
          'Family mix playlist',
          'Safe listening for kids',
          'Block explicit content',
        ],
      },
    ],
    reviews: [
      {
        id: '1',
        user: 'Alex Thompson',
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 5,
        comment:
          'The music discovery is unmatched! I find new favorites every week through their recommendations.',
        date: '2024-01-14',
        verified: true,
      },
      {
        id: '2',
        user: 'Maria Garcia',
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 5,
        comment:
          'Best music app hands down. The audio quality and offline features are perfect for my commute.',
        date: '2024-01-11',
        verified: true,
      },
    ],
    stats: {
      totalUsers: '500M+',
      contentHours: '70M+',
      countries: 180,
      rating: 4.7,
      satisfaction: '97%',
    },
  },
};
