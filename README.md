# ⚔️ Clash of Clans Hero Upgrade Visualizer ⚔️

An interactive web application that analyzes and visualizes percentage increases per level for all Clash of Clans hero statistics. This tool helps players make informed decisions about hero upgrades by showing which levels provide the best statistical improvements.

## 🌐 Live Demo

**[View the live application here](https://jamesjumawan.github.io/ClashOfClansHeroStatsVisualizer)** 🚀

No installation required - just click and start analyzing hero upgrades!

## 🚀 Quick Start

### Option 1: Use the Live Version (Recommended)
Simply visit [https://jamesjumawan.github.io/ClashOfClansHeroStatsVisualizer](https://jamesjumawan.github.io/ClashOfClansHeroStatsVisualizer) in your browser.

### Option 2: Run Locally
1. Clone or download this repository
2. Open `index.html` in a modern web browser

## 📁 Project Structure

```
clash/
├── index.html                        # Main application page
├── README.md                         # Project documentation
├── assets/                          # Static assets
│   ├── css/
│   │   └── hero_upgrade_visualizer.css  # Application styles
│   └── js/
│       ├── hero_upgrade_visualizer.js    # Core logic (Node.js compatible)
│       └── hero_upgrade_web_visualizer.js # Browser-compatible wrapper
├── data/                            # Hero statistics JSON files
│   ├── archer_queen_stats.json     # Archer Queen upgrade data
│   ├── barbarian_king_stats.json   # Barbarian King upgrade data
│   ├── grand_warden_stats.json     # Grand Warden upgrade data
│   ├── hero_hall_town_hall_mapping.json # Hero/Town Hall requirements
│   ├── minion_prince_stats.json    # Minion Prince upgrade data
│   └── royal_champion_stats.json   # Royal Champion upgrade data
└── src/
    └── hero_upgrade_logic.js       # Core business logic
```

## 📊 Features

### 🎯 Interactive Visualizations
- **Hero Selection**: Choose any hero to view detailed upgrade analysis
- **Multiple Chart Views**: 
  - Percentage increase per level
  - Raw stat values per level
  - Raw stat increase per level
- **Interactive Charts**: Hover over data points for detailed upgrade information

## 🔧 Technical Details

### Data Structure
Each hero data file contains:
- Level-by-level stat progressions
- Damage per second values
- Hitpoint progressions  
- Health recovery rates
- Upgrade costs and requirements

## 🎮 Understanding the Data

### Chart Views Explained
- **Percentage Increase**: Shows the % boost each level provides (most useful for efficiency)
- **Raw Stats**: Displays actual stat values at each level
- **Raw Increase**: Shows the numerical increase per level

## 📝 Data Sources & Updates

Hero statistics are manually compiled from:
- [Clash of Clans Wiki](https://clashofclans.fandom.com/wiki/Clash_of_Clans_Wiki)
---

*Built for the Clash of Clans community to optimize hero upgrade strategies* 🏰

**⭐ Star this repository if you find it helpful!**