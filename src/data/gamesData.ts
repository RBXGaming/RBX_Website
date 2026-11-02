import { GameItem, PS5CategoryGroup } from '../types';

/**
 * ==============================================================================
 * RBX GAMING CAFE - VERIFIED GAME ROSTER
 * ==============================================================================
 */

/**
 * PC GAME LIST
 * Available on ALL PC Stations (PC Station 1, 2, and 3 with NVIDIA RTX 5060 & 300Hz Monitors)
 */
export const pcGamesData: GameItem[] = [
  {
    id: 'pc-valorant',
    title: 'VALORANT',
    category: 'fps',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: true,
    tagline: '5v5 Character-Based Tactical FPS on 300Hz Displays',
    image: '/images/games/valorant.jpg',
  },
  {
    id: 'pc-cs2',
    title: 'COUNTER-STRIKE 2 (CS2)',
    category: 'fps',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: true,
    tagline: 'Competitive Tactical FPS on RTX 5060 Rigs',
    image: '/images/games/cs2.jpg',
  },
  {
    id: 'pc-warzone',
    title: 'CALL OF DUTY: WARZONE',
    category: 'fps',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: true,
    tagline: 'Fast-Paced Battle Royale Combat & Squad Scrims',
    image: '/images/games/cod-warzone.jpg',
  },
  {
    id: 'pc-pubg',
    title: 'PUBG',
    category: 'battleroyale',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: true,
    tagline: 'High-FPS Battle Royale Squad Survival',
    image: '/images/games/pubg.png',
  },
  {
    id: 'pc-gta5',
    title: 'GTA 5',
    category: 'action',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: true,
    tagline: 'Los Santos Open-World Action on High-Performance PCs',
    image: '/images/games/gta5.jpg',
  },
  {
    id: 'pc-minecraft',
    title: 'MINECRAFT',
    category: 'strategy',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: false,
    tagline: 'Creative Sandbox & Multiplayer Survival Worlds',
    image: '/images/games/minecraft.jpg',
  },
  {
    id: 'pc-roblox',
    title: 'ROBLOX',
    category: 'action',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: false,
    tagline: 'Multiplayer Community Games & Custom Adventures',
    image: '/images/games/roblox.jpg',
  },
  {
    id: 'pc-mecha-chameleon',
    title: 'MECHA CHAMELEON',
    category: 'action',
    platform: ['PC'],
    station: 'All PC Stations',
    popular: true,
    tagline: 'Dynamic Mech Action & Fast-Paced Combat',
    image: '/images/games/mecha-chameleon.png',
  },
];

/**
 * PS5 GAME CATEGORIES
 * Cleanly organized into the 3 verified categories with PS5-1 and PS5-2 station allocation.
 */
export const ps5CategoryGroups: PS5CategoryGroup[] = [
  {
    id: 'single-player-story',
    categoryTitle: 'CATEGORY 1 — SINGLE PLAYER STORY MODE',
    description: 'Immersive cinematic single-player narrative adventures on 4K PS5 Lounge stations.',
    ps5_1: [
      { title: 'SPIDER-MAN 2' },
      { title: 'HITMAN: WORLD OF ASSASSINATION' },
      { title: 'THE CREW MOTORFEST' },
    ],
    ps5_2: [
      { title: 'BATTLEFIELD 6' },
      { title: 'GTA 5' },
    ],
  },
  {
    id: 'multiplayer-story',
    categoryTitle: 'CATEGORY 2 — MULTIPLAYER STORY MODE',
    description: 'Cooperative story campaigns and two-player split-screen adventures.',
    ps5_1: [
      { title: 'SPLIT FICTION', players: '2 PLAYER' },
    ],
    ps5_2: [
      { title: 'IT TAKES TWO', players: '2 PLAYER' },
    ],
  },
  {
    id: 'multiplayer-fighting',
    categoryTitle: 'CATEGORY 3 — MULTIPLAYER FIGHTING GAMES',
    description: 'Intense head-to-head fighting, sports tournaments, and party multiplayer on PS5.',
    ps5_1: [
      { title: 'TEKKEN 8', players: '2 PLAYER' },
      { title: 'WWE 2K26', players: '4 PLAYER' },
      { title: 'CRICKET 26', players: '4 PLAYER' },
    ],
    ps5_2: [
      { title: 'MORTAL KOMBAT 1', players: '2 PLAYER' },
      { title: 'BATTLEFIELD 6', players: 'ONLINE PLAYER' },
      { title: 'WWE 2K24', players: '4 PLAYER' },
      { title: 'FIFA 26', players: '4 PLAYER' },
      { title: 'ROCKET LEAGUE', players: '4 PLAYER' },
    ],
  },
];

/**
 * PS5 Game Items for Unified Display
 */
export const ps5GamesData: GameItem[] = [
  // Category 1: Single Player Story Mode
  {
    id: 'ps5-spiderman-2',
    title: 'SPIDER-MAN 2',
    category: 'ps5_single',
    platform: ['PS5'],
    station: 'PS5-1',
    ps5Category: 'SINGLE PLAYER STORY MODE',
    popular: true,
    tagline: 'Next-Gen Marvel Action Adventure on PS5-1',
    image: '/images/games/spiderman2.jpg',
  },
  {
    id: 'ps5-hitman-woa',
    title: 'HITMAN: WORLD OF ASSASSINATION',
    category: 'ps5_single',
    platform: ['PS5'],
    station: 'PS5-1',
    ps5Category: 'SINGLE PLAYER STORY MODE',
    popular: true,
    tagline: 'Ultimate Stealth & Tactical Hitman Sandbox on PS5-1',
    image: '/images/games/hitman.jpg',
  },
  {
    id: 'ps5-the-crew',
    title: 'THE CREW MOTORFEST',
    category: 'racing',
    platform: ['PS5'],
    station: 'PS5-1',
    ps5Category: 'SINGLE PLAYER STORY MODE',
    popular: true,
    tagline: 'High-Speed Open-World Racing Thrills on PS5-1',
    image: '/images/games/crew-motorfest.jpg',
  },
  {
    id: 'ps5-battlefield-6-story',
    title: 'BATTLEFIELD 6',
    category: 'ps5_single',
    platform: ['PS5'],
    station: 'PS5-2',
    ps5Category: 'SINGLE PLAYER STORY MODE',
    popular: true,
    tagline: 'Cinematic Military Campaign on PS5-2',
    image: '/images/games/battlefield-6.jpg',
  },
  {
    id: 'ps5-gta5',
    title: 'GTA 5',
    category: 'action',
    platform: ['PS5'],
    station: 'PS5-2',
    ps5Category: 'SINGLE PLAYER STORY MODE',
    popular: true,
    tagline: 'Next-Gen 4K Los Santos Story Mode on PS5-2',
    image: '/images/games/gta5-ps5.jpg',
  },

  // Category 2: Multiplayer Story Mode
  {
    id: 'ps5-split-fiction',
    title: 'SPLIT FICTION',
    category: 'ps5_multi',
    platform: ['PS5'],
    station: 'PS5-1',
    players: '2 PLAYER',
    ps5Category: 'MULTIPLAYER STORY MODE',
    popular: true,
    tagline: '2-Player Co-op Story Campaign on PS5-1',
    image: '/images/games/split-fiction.jpg',
  },
  {
    id: 'ps5-it-takes-two',
    title: 'IT TAKES TWO',
    category: 'ps5_multi',
    platform: ['PS5'],
    station: 'PS5-2',
    players: '2 PLAYER',
    ps5Category: 'MULTIPLAYER STORY MODE',
    popular: true,
    tagline: 'Award-Winning 2-Player Co-op Adventure on PS5-2',
    image: '/images/games/it-takes-two.jpg',
  },

  // Category 3: Multiplayer Fighting Games
  {
    id: 'ps5-tekken-8',
    title: 'TEKKEN 8',
    category: 'ps5_fighting',
    platform: ['PS5'],
    station: 'PS5-1',
    players: '2 PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: 'Next-Gen 3D Versus Fighting (2 Player) on PS5-1',
    image: '/images/games/tekken8.jpg',
  },
  {
    id: 'ps5-wwe-2k26',
    title: 'WWE 2K26',
    category: 'sports',
    platform: ['PS5'],
    station: 'PS5-1',
    players: '4 PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: '4-Player Ring Battles & Royal Rumble on PS5-1',
    image: '/images/games/wwe-2k26.png',
  },
  {
    id: 'ps5-cricket-26',
    title: 'CRICKET 26',
    category: 'sports',
    platform: ['PS5'],
    station: 'PS5-1',
    players: '4 PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: '4-Player Pro Cricket Matches & Tournaments on PS5-1',
    image: '/images/games/cricket-26.jpg',
  },
  {
    id: 'ps5-mortal-kombat-1',
    title: 'MORTAL KOMBAT 1',
    category: 'ps5_fighting',
    platform: ['PS5'],
    station: 'PS5-2',
    players: '2 PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: 'Brutal 2-Player Versus Combat & Kameo Action on PS5-2',
    image: '/images/games/mortal-kombat-1.jpg',
  },
  {
    id: 'ps5-battlefield-6-online',
    title: 'BATTLEFIELD 6',
    category: 'fps',
    platform: ['PS5'],
    station: 'PS5-2',
    players: 'ONLINE PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: 'Online Multiplayer All-Out Warfare on PS5-2',
    image: '/images/games/battlefield-6.jpg',
  },
  {
    id: 'ps5-wwe-2k24',
    title: 'WWE 2K24',
    category: 'sports',
    platform: ['PS5'],
    station: 'PS5-2',
    players: '4 PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: '4-Player Multiplayer Wrestling Mayhem on PS5-2',
    image: '/images/games/wwe-2k24.jpg',
  },
  {
    id: 'ps5-fifa-26',
    title: 'FIFA 26',
    category: 'sports',
    platform: ['PS5'],
    station: 'PS5-2',
    players: '4 PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: '4-Player Pro Football Tournaments on PS5-2',
    image: '/images/games/fifa-26.jpg',
  },
  {
    id: 'ps5-rocket-league',
    title: 'ROCKET LEAGUE',
    category: 'sports',
    platform: ['PS5'],
    station: 'PS5-2',
    players: '4 PLAYER',
    ps5Category: 'MULTIPLAYER FIGHTING GAMES',
    popular: true,
    tagline: 'High-Octane 4-Player Car Soccer Battles on PS5-2',
    image: '/images/games/rocket-league.jpg',
  },
];

/**
 * Combined Complete Game Catalog
 */
export const gamesData: GameItem[] = [...pcGamesData, ...ps5GamesData];
