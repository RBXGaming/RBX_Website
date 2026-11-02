import React, { useState } from 'react';
import { Search, Gamepad2, Monitor, Play, Users, Sparkles, Layers, Grid } from 'lucide-react';
import { gamesData, ps5CategoryGroups, pcGamesData, ps5GamesData } from '../../data/gamesData';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';

interface PopularGamesSectionProps {
  onSelectGame?: (gameTitle: string) => void;
}

export const PopularGamesSection: React.FC<PopularGamesSectionProps> = ({ onSelectGame }) => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'ps5-categories'>('cards');

  const filterTabs = [
    { id: 'all', label: 'All Titles', count: gamesData.length },
    { id: 'pc', label: 'PC Games (All Rigs)', count: pcGamesData.length },
    { id: 'ps5', label: 'All PS5 Games', count: ps5GamesData.length },
    { id: 'ps5-single', label: 'PS5 Single Player Story', count: 5 },
    { id: 'ps5-multi-story', label: 'PS5 Multiplayer Story', count: 2 },
    { id: 'ps5-fighting', label: 'PS5 Fighting & Multiplayer', count: 8 },
  ];

  const filteredGames = gamesData.filter((game) => {
    let matchesCategory = true;
    if (selectedTab === 'pc') {
      matchesCategory = game.platform.includes('PC');
    } else if (selectedTab === 'ps5') {
      matchesCategory = game.platform.includes('PS5');
    } else if (selectedTab === 'ps5-single') {
      matchesCategory = game.ps5Category === 'SINGLE PLAYER STORY MODE';
    } else if (selectedTab === 'ps5-multi-story') {
      matchesCategory = game.ps5Category === 'MULTIPLAYER STORY MODE';
    } else if (selectedTab === 'ps5-fighting') {
      matchesCategory = game.ps5Category === 'MULTIPLAYER FIGHTING GAMES';
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      game.title.toLowerCase().includes(q) ||
      game.tagline.toLowerCase().includes(q) ||
      (game.station && game.station.toLowerCase().includes(q)) ||
      (game.players && game.players.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 lg:py-28 bg-rbx-dark-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Verified Game Roster"
          title="PLAY YOUR"
          highlightText="FAVORITE GAMES"
          subtitle="Pre-installed, patched, and optimized for high-FPS competitive esports on RTX 5060 PC rigs and 4K PS5 Lounges."
        />

        {/* View Toggle & Search Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id);
                  if (tab.id.startsWith('ps5') && viewMode === 'ps5-categories') {
                    // keep category view
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTab === tab.id
                    ? 'bg-rbx-red text-white shadow-glow-subtle'
                    : 'bg-rbx-dark-800 text-rbx-dark-300 hover:text-white hover:bg-rbx-dark-700 border border-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedTab === tab.id ? 'bg-black/30 text-white' : 'bg-white/10 text-rbx-dark-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Switcher & Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* View Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-rbx-dark-800 border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-rbx-red text-white shadow-sm'
                    : 'text-rbx-dark-400 hover:text-white'
                }`}
                title="Cards Gallery View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gallery</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ps5-categories')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'ps5-categories'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-rbx-dark-400 hover:text-white'
                }`}
                title="PS5 Station & Category Matrix"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PS5 Matrix</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-rbx-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search games, station, players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60 focus:ring-1 focus:ring-rbx-red/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* VIEW 1: PS5 STATION & CATEGORY MATRIX VIEW */}
        {viewMode === 'ps5-categories' ? (
          <div className="space-y-8 animate-fade-in">
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>PS5 Games organized by category and station allocation (<strong>PS5-1</strong> and <strong>PS5-2</strong>).</span>
              </div>
              <button
                onClick={() => setViewMode('cards')}
                className="text-xs text-blue-400 hover:text-white font-bold underline cursor-pointer shrink-0"
              >
                Switch to Card Grid ➔
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {ps5CategoryGroups.map((catGroup) => (
                <div
                  key={catGroup.id}
                  className="p-6 sm:p-8 rounded-3xl glass-panel border border-rbx-border space-y-6 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-rbx-red block">
                        PS5 Category
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
                        {catGroup.categoryTitle}
                      </h3>
                      <p className="text-xs text-rbx-dark-300 mt-0.5">
                        {catGroup.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PS5-1 Station Column */}
                    <div className="p-5 rounded-2xl bg-rbx-dark-800/90 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-black text-white font-display uppercase">
                            PS5-1 STATION
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {catGroup.ps5_1.length} Game(s)
                        </span>
                      </div>

                      {catGroup.ps5_1.length === 0 ? (
                        <p className="text-xs text-rbx-dark-400 italic py-2">No games in this category on PS5-1</p>
                      ) : (
                        <div className="space-y-2">
                          {catGroup.ps5_1.map((g, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-rbx-dark-900 border border-white/5 flex items-center justify-between gap-3 text-xs"
                            >
                              <span className="font-bold text-white uppercase tracking-wide">
                                {g.title}
                              </span>
                              {g.players && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                                  {g.players}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PS5-2 Station Column */}
                    <div className="p-5 rounded-2xl bg-rbx-dark-800/90 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-black text-white font-display uppercase">
                            PS5-2 STATION
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {catGroup.ps5_2.length} Game(s)
                        </span>
                      </div>

                      {catGroup.ps5_2.length === 0 ? (
                        <p className="text-xs text-rbx-dark-400 italic py-2">No games in this category on PS5-2</p>
                      ) : (
                        <div className="space-y-2">
                          {catGroup.ps5_2.map((g, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-rbx-dark-900 border border-white/5 flex items-center justify-between gap-3 text-xs"
                            >
                              <span className="font-bold text-white uppercase tracking-wide">
                                {g.title}
                              </span>
                              {g.players && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                                  {g.players}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 2: STANDARD INTERACTIVE CARDS GALLERY */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="group rounded-2xl glass-panel overflow-hidden border-rbx-border hover:border-rbx-red/40 hover:-translate-y-2 hover:shadow-glow-red transition-all duration-300 flex flex-col justify-between"
              >
                {/* Game Poster Image */}
                <div className="relative h-48 w-full overflow-hidden bg-rbx-dark-800">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rbx-card via-rbx-card/30 to-transparent" />

                  {/* Top Left: Players or Hot Pick Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {game.players ? (
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-black text-amber-400 border border-amber-500/40 uppercase tracking-wider shadow-md">
                        {game.players}
                      </span>
                    ) : game.platform.includes('PC') ? (
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-black text-emerald-400 border border-emerald-500/40 uppercase tracking-wider shadow-md">
                        ALL PC RIGS
                      </span>
                    ) : null}
                  </div>

                  {/* Top Right: Station Allocation Badge (PS5-1, PS5-2, PC) */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {game.station ? (
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 flex items-center gap-1">
                        {game.platform.includes('PC') ? (
                          <Monitor className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Gamepad2 className="w-3 h-3 text-blue-400" />
                        )}
                        <span>{game.station}</span>
                      </span>
                    ) : (
                      game.platform.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/15 flex items-center gap-1"
                        >
                          {p === 'PC' ? <Monitor className="w-3 h-3 text-cyan-400" /> : <Gamepad2 className="w-3 h-3 text-blue-400" />}
                          {p}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {game.ps5Category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rbx-red block mb-1">
                        {game.ps5Category}
                      </span>
                    )}

                    <h3 className="text-lg font-black text-white font-display uppercase tracking-wide group-hover:text-rbx-red transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-rbx-dark-300 mt-1.5 leading-relaxed line-clamp-2">
                      {game.tagline}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-rbx-dark-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Ready to Play
                    </span>

                    {onSelectGame && (
                      <button
                        onClick={() => onSelectGame(game.title)}
                        className="text-white hover:text-rbx-red font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current text-rbx-red" />
                        <span>Book Rig</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredGames.length === 0 && viewMode === 'cards' && (
          <div className="text-center py-16 p-8 rounded-2xl glass-panel">
            <p className="text-rbx-dark-300 text-sm">
              No games found matching "{searchQuery}".
            </p>
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="mt-12 p-4 rounded-2xl bg-rbx-dark-800/60 border border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-rbx-dark-300 gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>All PC games are installed and updated on all 3 RTX 5060 gaming rigs. PS5 games are pre-installed on designated PS5-1 / PS5-2 lounges.</span>
          </div>
          <span className="text-emerald-400 font-bold uppercase shrink-0">Open 24/7 in Gota, Ahmedabad</span>
        </div>

      </div>
    </section>
  );
};
