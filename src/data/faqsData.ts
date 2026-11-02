export interface FAQItem {
  question: string;
  answer: string;
  category: 'booking' | 'hardware' | 'pricing' | 'rules';
}

export const faqsData: FAQItem[] = [
  {
    question: "What are your exact opening hours?",
    answer: "RBX Gaming Cafe is OPEN 24/7 — 24 hours a day, 7 days a week, every single day.",
    category: 'pricing',
  },
  {
    question: "What is the pricing for PC and PS5 gaming?",
    answer: "PC Gaming is ₹100 per person / hour. PS5 Gaming is ₹120 per person / hour for Single Player, and ₹100 per person / hour for Multiplayer.",
    category: 'pricing',
  },
  {
    question: "What are the PC specifications?",
    answer: "Our gaming PCs are equipped with NVIDIA RTX 5060 graphics cards and ultra-fast 300Hz gaming monitors for high-performance competitive gaming.",
    category: 'hardware',
  },
  {
    question: "Do I need to pre-book or can I just walk in?",
    answer: "Walk-ins are welcome 24/7! However, you can also reserve your spot online or via WhatsApp to ensure your station is ready when you arrive.",
    category: 'booking',
  },
  {
    question: "What games are pre-installed on the PCs and PS5s?",
    answer: "Popular titles are pre-installed and kept updated, including Valorant, Counter-Strike 2, Call of Duty: Warzone, PUBG, GTA 5, Minecraft, Roblox, Mecha Chameleon, Spider-Man 2, Tekken 8, Mortal Kombat 1, FIFA 26, WWE 2K, and more.",
    category: 'hardware',
  },
  {
    question: "Where is RBX Gaming Cafe located?",
    answer: "We are located at 115, First Floor, Rudram Icon, Opp. Lambda House, Near Silver Oak University, Gota, Ahmedabad, Gujarat – 382481.",
    category: 'booking',
  },
];
