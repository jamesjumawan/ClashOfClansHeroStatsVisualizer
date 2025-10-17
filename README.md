# ⚔️ Clash of Clans Hero Upgrade Visualizer ⚔️

An interactive web application that analyzes and visualizes percentage increases per level for all Clash of Clans hero statistics. This tool helps players make informed decisions about hero upgrades by showing which levels provide the best statistical improvements.

## 🚀 Quick Start

1. Open `index.html` in a modern web browser
2. Select a hero from the dropdown menu to view detailed upgrade analysis
3. Switch between different chart views (Percentage Increase, Raw Stats, Raw Increase)
4. Use the cross-hero comparison table to identify the most efficient upgrades

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
- **Responsive Design**: Optimized for desktop and mobile viewing

### 📈 Statistical Analysis
- **Summary Statistics**: Average, maximum, and minimum percentage increases
- **Top Upgrades**: Identifies the most efficient upgrade levels
- **Cross-Hero Comparison**: Side-by-side efficiency comparison
- **Level-by-Level Breakdown**: Detailed analysis of each upgrade

### 🏆 Hero Coverage
- **Barbarian King**: Damage, HP, and recovery analysis
- **Archer Queen**: Complete upgrade efficiency metrics
- **Grand Warden**: All stat progressions covered
- **Royal Champion**: Full upgrade analysis
- **Minion Prince**: Latest hero statistics included

## 🔧 Technical Details

### Dependencies
- **Chart.js**: Interactive chart rendering (loaded from CDN)
- **Modern Browser**: ES6+ JavaScript support required

### Architecture
- **Modular Design**: Separate logic for Node.js and browser environments
- **Data-Driven**: JSON-based hero statistics for easy updates
- **Client-Side Processing**: No server required, runs entirely in browser
- **Responsive CSS**: Mobile-first design approach

### Data Structure
Each hero data file contains:
- Level-by-level stat progressions
- Damage per second values
- Hitpoint progressions  
- Health recovery rates
- Upgrade costs and requirements

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎮 Understanding the Data

### Chart Views Explained
- **Percentage Increase**: Shows the % boost each level provides (most useful for efficiency)
- **Raw Stats**: Displays actual stat values at each level
- **Raw Increase**: Shows the numerical increase per level

### Strategic Tips
- Focus on levels with higher percentage increases for maximum efficiency
- Use the comparison table to identify which heroes scale best
- Green highlighting indicates the best performers in each category

## 🔄 Future Enhancements

- Equipment and ability analysis
- Cost-efficiency calculations
- Town Hall progression recommendations
- Export functionality for planning tools

## 📝 Data Sources

Hero statistics are manually compiled from official Clash of Clans game data and community resources. Data is regularly updated to reflect game balance changes.

---

*Built for the Clash of Clans community to optimize hero upgrade strategies* 🏰