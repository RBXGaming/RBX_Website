import { OfferItem } from '../types';

export const offersData: OfferItem[] = [
  {
    id: 'pc-3-plus-1-free',
    title: 'PC GAMING OFFER',
    tagline: '3 HOURS + 1 HOUR FREE',
    description: 'Book 3 consecutive hours on our RTX 5060 PC rigs and get your 4th hour completely FREE! (Valid for PC Gaming only. Does not apply to PS5).',
    badge: 'PC Only Offer',
    discountText: '3 Hours + 1 Hour Free (PC Only)',
    validity: 'Valid for PC Gaming only • Open 24/7',
    highlight: true,
  },
  {
    id: 'ps5-multiplayer-pricing',
    title: 'PS5 MULTIPLAYER SESSIONS',
    tagline: 'MULTIPLAYER AT ₹100 / PERSON / HOUR',
    description: 'Play with friends on PS5 for sports, fighting, and co-op games at standard rate of ₹100 per person / hour. Single player rate is ₹120 per person / hour.',
    badge: 'PS5 Standard Rate',
    discountText: '₹100 / Person / Hr (Multiplayer)',
    validity: 'Open 24/7 • Standard Rate',
    highlight: false,
  },
];
