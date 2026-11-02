export const siteConfig = {
  name: "RBX Gaming Cafe",
  tagline: "Level Up Your Game",
  shortDescription: "Ahmedabad's premier 24/7 gaming destination featuring NVIDIA RTX 5060 gaming PCs, 300Hz gaming monitors, premium PS5 single & multiplayer gaming, and competitive esports.",
  
  contact: {
    phone: "8320165115",
    phoneDisplay: "+91 83201 65115",
    whatsapp: "8320165115",
    email: "contact@rbxgamingcafe.com",
    address: {
      line1: "115, First Floor, Rudram Icon",
      line2: "Opp. Lambda House, Near Silver Oak University",
      locality: "Gota",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      pincode: "382481",
      full: "115, First Floor, Rudram Icon, Opp. Lambda House, Near Silver Oak University, Gota, Ahmedabad, Gujarat – 382481",
    },
    googleMapsUrl: "https://www.google.com/maps/place/RBX+gaming+Cafe/@23.0894869,72.5301008,17z/data=!3m1!4b1!4m6!3m5!1s0x395e8336a53c9183:0x4c004ff691f761c8!8m2!3d23.0894869!4d72.5326757!16s%2Fg%2F11mf5b1z15",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.627393457508!2d72.5301008!3d23.0894869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8336a53c9183%3A0x4c004ff691f761c8!2sRBX%20gaming%20Cafe!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },

  timings: {
    days: "Open 24 Hours • Every Day (7 Days a Week)",
    hours: "Open 24/7",
    status: "OPEN 24/7",
  },

  stats: [
    { label: "Graphics", value: "RTX 5060", suffix: "Gaming PCs" },
    { label: "Monitors", value: "300Hz", suffix: "High-Refresh" },
    { label: "PS5 Gaming", value: "Single / Multi", suffix: "Lounge Setup" },
    { label: "Schedule", value: "OPEN 24/7", suffix: "Non-Stop" },
  ],

  socials: {
    instagram: "https://instagram.com/rbxgamingcafe",
    discord: "https://discord.gg/rbxgaming",
    youtube: "https://youtube.com/@rbxgamingcafe",
  },

  features: [
    {
      id: "pc-hardware",
      title: "RTX 5060 GAMING PCs",
      description: "High-performance gaming setup powered by NVIDIA RTX 5060 for maximum competitive frame rates.",
      icon: "Cpu",
    },
    {
      id: "monitors",
      title: "300Hz GAMING MONITORS",
      description: "Ultra-smooth competitive gaming with fast response 300Hz gaming displays.",
      icon: "Monitor",
    },
    {
      id: "ps5",
      title: "PREMIUM PS5 GAMING",
      description: "Single & multiplayer sessions with comfortable seating and the latest titles.",
      icon: "Gamepad2",
    },
    {
      id: "hours-247",
      title: "OPEN 24/7",
      description: "Open 24 hours, every day. Drop in whenever you want for rank pushes and casual sessions.",
      icon: "Clock",
    },
    {
      id: "events",
      title: "Regular Esports Events",
      description: "Community gaming tournaments, LAN events, and team competitions.",
      icon: "Trophy",
    },
  ],

  pricing: {
    pcHourly: 100, // ₹100 / person / hour (9:30 AM – 10:00 PM)
    ps5SingleHourly: 120, // ₹120 / person / hour (9:30 AM – 10:00 PM)
    ps5MultiHourly: 100, // ₹100 / person / hour (9:30 AM – 10:00 PM)
    overnightHourly: 120, // ₹120 / person / hour for ALL setups (10:00 PM – 9:30 AM)
    dayWindowLabel: "9:30 AM – 10:00 PM",
    nightWindowLabel: "10:00 PM – 9:30 AM",
    currency: "₹",
    currencyCode: "INR",
  },
};

/**
 * Helper to generate pre-filled WhatsApp click-to-chat links
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = "Hi RBX Gaming Cafe! I would like to book a gaming session.";
  const msg = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/91${siteConfig.contact.whatsapp}?text=${msg}`;
}

export function getBookingWhatsAppUrl(details: {
  type: string;
  players: number;
  date: string;
  time: string;
  duration: number;
  name: string;
  total: number;
}): string {
  const msg = `🎮 *RBX Gaming Cafe - Booking Request*
━━━━━━━━━━━━━━━━━━━━
👤 *Gamer Name:* ${details.name}
🕹️ *Option:* ${details.type}
👥 *Players:* ${details.players}
📅 *Date:* ${details.date}
⏰ *Time Slot:* ${details.time}
⏳ *Duration:* ${details.duration} Hour(s)
💰 *Estimated Total:* ₹${details.total}
🕒 *Venue:* Open 24/7 (Gota, Ahmedabad)
━━━━━━━━━━━━━━━━━━━━
Please confirm my session availability. Thank you!`;

  return `https://wa.me/91${siteConfig.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
}
