# Clash of Clans Hero Upgrade Visualizer

An interactive web application that analyzes and visualizes percentage increases per level for all Clash of Clans hero statistics.

## 📁 Project Structure

```
clash/
├── README.md                          # Project documentation
├── hero_upgrade_visualizer.html       # Main application page
├── temp.html                         # Temporary/test file
├── assets/                           # Static assets
│   ├── css/                         # Stylesheets
│   │   └── hero_upgrade_visualizer.css
│   └── js/                          # Client-side JavaScript
│       ├── hero_upgrade_visualizer.js
│       └── hero_upgrade_web_visualizer.js
├── data/                            # JSON data files
│   ├── archer_queen_stats.json     # Archer Queen statistics
│   ├── barbarian_king_stats.json   # Barbarian King statistics
│   ├── grand_warden_stats.json     # Grand Warden statistics
│   ├── hero_hall_town_hall_mapping.json # Hero/TH mappings
│   ├── minion_prince_stats.json    # Minion Prince statistics
│   └── royal_champion_stats.json   # Royal Champion statistics
├── src/                             # Core application logic
│   ├── hero_stats_calculator.js    # Statistics calculation logic
│   └── hero_upgrade_logic.js       # Hero upgrade business logic
└── utils/                          # Utility functions (empty for now)
```

## 🚀 Getting Started

1. Open `hero_upgrade_visualizer.html` in a modern web browser
2. The application will automatically load hero data and generate interactive charts
3. Explore the visualizations to analyze hero upgrade efficiency

## 📊 Features

- **Interactive Charts**: Hover over data points for detailed information
- **Cross-Hero Comparison**: Compare upgrade efficiency across all heroes
- **Statistical Analysis**: View average, maximum, and minimum percentage increases
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Development

### File Organization

- **`/data/`**: Contains all JSON data files with hero statistics
- **`/assets/css/`**: Stylesheets for visual presentation
- **`/assets/js/`**: Client-side JavaScript for UI interactions
- **`/src/`**: Core business logic and calculations
- **`/utils/`**: Shared utility functions (future expansion)

### Dependencies

- Chart.js (loaded from CDN)
- Modern web browser with ES6 support

## 📝 Notes

This project follows web development best practices:
- Separation of concerns (data, presentation, logic)
- Organized file structure
- Modular JavaScript architecture
- Responsive CSS design

## 🎮 About Clash of Clans Heroes

This visualizer covers all major heroes:
- Barbarian King
- Archer Queen
- Grand Warden
- Royal Champion
- Minion Prince

Each hero's damage per second, hitpoints, and health recovery statistics are analyzed to show upgrade efficiency at each level.