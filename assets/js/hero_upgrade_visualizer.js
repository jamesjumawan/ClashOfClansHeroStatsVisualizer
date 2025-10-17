const fs = require('fs');
const path = require('path');

// ANSI Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Text colors
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    // Bright colors
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m'
};

// Helper functions for colored output
function colorize(text, color) {
    return `${color}${text}${colors.reset}`;
}

function header(text) {
    return colorize(text, colors.bright + colors.cyan);
}

function statLabel(text) {
    return colorize(text, colors.blue);
}

function heroName(text) {
    return colorize(text, colors.bright + colors.yellow);
}

function positive(text) {
    return colorize(text, colors.brightGreen);
}

function warning(text) {
    return colorize(text, colors.brightYellow);
}

function info(text) {
    return colorize(text, colors.cyan);
}

// Load all hero data
const heroFiles = [
    { name: 'Barbarian King', file: './barbarian_king_stats.json' },
    { name: 'Archer Queen', file: './archer_queen_stats.json' },
    { name: 'Minion Prince', file: './minion_prince_stats.json' },
    { name: 'Grand Warden', file: './grand_warden_stats.json' },
    { name: 'Royal Champion', file: './royal_champion_stats.json' }
];

// Load hero data
const heroData = {};
heroFiles.forEach(hero => {
    if (fs.existsSync(hero.file)) {
        heroData[hero.name] = JSON.parse(fs.readFileSync(hero.file, 'utf8'));
    }
});

// Function to calculate percentage increase from previous level
function calculatePercentageIncrease(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

// Function to create ASCII graph
function createASCIIGraph(data, title, maxHeight = 20, maxWidth = 80) {
    if (data.length === 0) return [];
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    
    // If all values are the same, set a small range to avoid division by zero
    const normalizedRange = range === 0 ? 1 : range;
    
    const graph = [];
    
    // Title
    graph.push(header(`\n=== ${title} ===`));
    graph.push(info(`Range: ${minValue.toFixed(2)}% to ${maxValue.toFixed(2)}%\n`));
    
    // Y-axis and graph
    for (let row = maxHeight; row >= 0; row--) {
        const threshold = minValue + (row / maxHeight) * normalizedRange;
        let line = `${threshold.toFixed(1).padStart(6)}% |`;
        
        for (let i = 0; i < data.length; i++) {
            const value = data[i].value;
            const level = data[i].level;
            
            if (value >= threshold) {
                // Color code based on percentage increase
                if (value >= 5) line += colorize('█', colors.brightGreen);
                else if (value >= 3) line += colorize('█', colors.brightYellow);
                else if (value >= 1) line += colorize('█', colors.yellow);
                else if (value > 0) line += colorize('█', colors.blue);
                else line += colorize('█', colors.dim);
            } else {
                line += ' ';
            }
        }
        
        graph.push(line);
    }
    
    // X-axis
    let xAxis = '       |';
    let levelNumbers = '       ';
    
    for (let i = 0; i < data.length; i++) {
        if (i % 5 === 0 || i === data.length - 1) {
            xAxis += '+';
            levelNumbers += data[i].level.toString().padStart(1);
        } else {
            xAxis += '-';
            levelNumbers += ' ';
        }
    }
    
    graph.push(xAxis);
    graph.push(levelNumbers + ' (Level)');
    
    return graph;
}

// Function to generate upgrade data for a hero stat
function generateUpgradeData(heroStats, statName) {
    const data = [];
    
    for (let i = 1; i < heroStats.length; i++) {
        const currentLevel = heroStats[i];
        const previousLevel = heroStats[i - 1];
        
        if (currentLevel && previousLevel) {
            const currentValue = currentLevel[statName];
            const previousValue = previousLevel[statName];
            const percentageIncrease = calculatePercentageIncrease(currentValue, previousValue);
            
            data.push({
                level: currentLevel.level,
                value: percentageIncrease,
                actualValue: currentValue,
                previousValue: previousValue
            });
        }
    }
    
    return data;
}

// Function to generate summary statistics
function generateSummaryStats(data) {
    if (data.length === 0) return {};
    
    const values = data.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const maxLevel = data.find(d => d.value === max)?.level;
    const minLevel = data.find(d => d.value === min)?.level;
    
    return { avg, max, min, maxLevel, minLevel };
}

// Main function
function main() {
    console.log(header('=== Hero Upgrade Percentage Visualizer ===\n'));
    
    Object.keys(heroData).forEach(heroNameKey => {
        const hero = heroData[heroNameKey];
        const stats = hero.stats;
        
        console.log(heroName(`\n--- ${heroNameKey} ---`));
        
        // Generate graphs for each stat
        const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
        const statDisplayNames = ['Damage Per Second', 'Hitpoints', 'Health Recovery'];
        
        statTypes.forEach((statType, index) => {
            const upgradeData = generateUpgradeData(stats, statType);
            const displayName = statDisplayNames[index];
            
            if (upgradeData.length > 0) {
                const graph = createASCIIGraph(upgradeData, `${heroNameKey} - ${displayName} % Increase per Level`);
                graph.forEach(line => console.log(line));
                
                // Summary statistics
                const summary = generateSummaryStats(upgradeData);
                console.log(statLabel('\nSummary Statistics:'));
                console.log(`  ${statLabel('Average Increase:')} ${positive(summary.avg.toFixed(2) + '%')}`);
                console.log(`  ${statLabel('Highest Increase:')} ${positive(summary.max.toFixed(2) + '%')} ${info('(Level ' + summary.maxLevel + ')')}`);
                console.log(`  ${statLabel('Lowest Increase:')} ${warning(summary.min.toFixed(2) + '%')} ${info('(Level ' + summary.minLevel + ')')}`);
                
                // Show levels with highest increases
                const topIncreases = upgradeData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3);
                
                console.log(`  ${statLabel('Top 3 Increases:')}`);
                topIncreases.forEach((increase, i) => {
                    console.log(`    ${i + 1}. ${positive('Level ' + increase.level + ': +' + increase.value.toFixed(2) + '%')} ${info('(' + increase.previousValue + ' → ' + increase.actualValue + ')')}`);
                });
                
                console.log('\n');
            }
        });
        
        // Generate comparison summary for this hero
        console.log(statLabel(`--- ${heroNameKey} Stat Comparison ---`));
        const allStats = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
        const allDisplayNames = ['DPS', 'HP', 'Recovery'];
        
        allStats.forEach((statType, index) => {
            const upgradeData = generateUpgradeData(stats, statType);
            if (upgradeData.length > 0) {
                const summary = generateSummaryStats(upgradeData);
                const displayName = allDisplayNames[index];
                console.log(`  ${statLabel(displayName + ' Average Increase:')} ${positive(summary.avg.toFixed(2) + '%')}`);
            }
        });
        
        console.log('\n' + '='.repeat(80));
    });
    
    // Cross-hero comparison
    console.log(header('\n=== Cross-Hero Stat Comparison ===\n'));
    
    const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
    const statDisplayNames = ['Damage Per Second', 'Hitpoints', 'Health Recovery'];
    
    statTypes.forEach((statType, index) => {
        const displayName = statDisplayNames[index];
        console.log(heroName(`--- ${displayName} Across All Heroes ---`));
        
        Object.keys(heroData).forEach(heroNameKey => {
            const hero = heroData[heroNameKey];
            const upgradeData = generateUpgradeData(hero.stats, statType);
            
            if (upgradeData.length > 0) {
                const summary = generateSummaryStats(upgradeData);
                console.log(`  ${statLabel(heroNameKey + ':')} ${positive('Avg: ' + summary.avg.toFixed(2) + '%')} ${info('Max: ' + summary.max.toFixed(2) + '% (Lv' + summary.maxLevel + ')')}`);
            }
        });
        
        console.log('');
    });
    
    // Legend
    console.log(header('=== Legend ==='));
    console.log(`${colorize('█', colors.brightGreen)} High increase (≥5%)`);
    console.log(`${colorize('█', colors.brightYellow)} Good increase (3-5%)`);
    console.log(`${colorize('█', colors.yellow)} Moderate increase (1-3%)`);
    console.log(`${colorize('█', colors.blue)} Small increase (0-1%)`);
    console.log(`${colorize('█', colors.dim)} Minimal/no increase\n`);
    
    console.log(info('Note: Each column represents one level upgrade showing the percentage increase from the previous level.'));
    console.log(info('The graphs help identify which levels provide the biggest stat boosts for each hero.'));
}

// Export the functions for potential use in other scripts
module.exports = {
    generateUpgradeData,
    createASCIIGraph,
    generateSummaryStats,
    calculatePercentageIncrease
};

// Run the script if called directly
if (require.main === module) {
    main();
}