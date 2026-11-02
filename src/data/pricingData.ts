import { PricingPlan } from '../types';
import { siteConfig } from '../config/siteConfig';

export const verifiedPricing = {
  pc: {
    title: 'PC GAMING',
    rate: siteConfig.pricing.pcHourly,
    unit: 'person / hour',
    gpu: 'NVIDIA RTX 5060',
    monitor: '300Hz Gaming Monitors',
    description: 'High-performance gaming setup',
  },
  ps5Single: {
    title: 'PS5 (SINGLE PLAYER)',
    rate: siteConfig.pricing.ps5SingleHourly,
    unit: 'person / hour',
    description: 'Premium PS5 gaming for solo players',
  },
  ps5Multi: {
    title: 'PS5 (MULTIPLAYER)',
    rate: siteConfig.pricing.ps5MultiHourly,
    unit: 'person / hour',
    description: 'Premium PS5 gaming for multiplayer sessions',
  },
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'pc-gaming',
    title: 'PC GAMING',
    subtitle: 'NVIDIA RTX 5060 • 300Hz Gaming Monitor',
    type: 'pc',
    rate: siteConfig.pricing.pcHourly,
    unit: 'per person / hour',
    specs: ['NVIDIA RTX 5060', '300Hz Gaming Monitors', 'High-performance gaming setup'],
    description: 'High-performance gaming setup with NVIDIA RTX 5060 and ultra-fast 300Hz monitors for competitive and casual gaming.',
    popular: true,
    features: [
      'NVIDIA RTX 5060 Graphics',
      '300Hz Gaming Monitors',
      'High-Performance Gaming Setup',
      'Popular competitive & casual titles installed',
      'Open 24 Hours • Every Day (24/7)',
    ],
  },
  {
    id: 'ps5-single',
    title: 'PS5 GAMING',
    subtitle: 'SINGLE PLAYER',
    type: 'ps5_single',
    rate: siteConfig.pricing.ps5SingleHourly,
    unit: 'per person / hour',
    specs: ['Sony PlayStation 5', 'Single Player Session', 'Latest Popular Titles'],
    description: 'Premium PS5 solo gaming experience with comfortable seating and the latest popular titles.',
    popular: false,
    features: [
      'Premium PS5 Console Setup',
      'Dedicated Single Player Gaming',
      'Latest popular titles ready to play',
      'Comfortable gaming environment',
      'Open 24 Hours • Every Day (24/7)',
    ],
  },
  {
    id: 'ps5-multiplayer',
    title: 'PS5 GAMING',
    subtitle: 'MULTIPLAYER',
    type: 'ps5_multi',
    rate: siteConfig.pricing.ps5MultiHourly,
    unit: 'per person / hour',
    specs: ['Sony PlayStation 5', 'Multiplayer Sessions', 'Dual & Squad Gaming'],
    description: 'Multiplayer console gaming with friends for sports, fighting, and co-op matches.',
    popular: true,
    features: [
      'Premium PS5 Console Setup',
      'Multiplayer sessions with friends',
      'Multiple wireless controllers',
      'EA FC, fighting & co-op multiplayer titles',
      'Open 24 Hours • Every Day (24/7)',
    ],
  },
];
