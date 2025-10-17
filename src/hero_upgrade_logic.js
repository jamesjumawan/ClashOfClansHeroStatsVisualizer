import { existsSync, readFileSync } from 'fs';

// Hero data configuration
const heroFiles = [
    { name: 'Barbarian King', file: './barbarian_king_stats.json' },
    { name: 'Archer Queen', file: './archer_queen_stats.json' },
    { name: 'Minion Prince', file: './minion_prince_stats.json' },
    { name: 'Grand Warden', file: './grand_warden_stats.json' },
    { name: 'Royal Champion', file: './royal_champion_stats.json' }
];

// Statistical calculation functions
function calculatePercentageIncrease(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

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

function getTopIncreases(data, count = 3) {
    return [...data]
        .sort((a, b) => b.value - a.value)
        .slice(0, count);
}

// Chart data generation
function generateChartData(heroName, statName, upgradeData) {
    const displayNames = {
        'damagePerSecond': 'Damage Per Second',
        'hitpoints': 'Hitpoints',
        'healthRecovery': 'Health Recovery'
    };
    
    const colors = {
        'damagePerSecond': { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
        'hitpoints': { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
        'healthRecovery': { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' }
    };
    
    // Ensure data is sorted by level for consistent chart display
    const sortedByLevel = [...upgradeData].sort((a, b) => a.level - b.level);
    
    return {
        labels: sortedByLevel.map(d => `Level ${d.level}`),
        datasets: [{
            label: `${heroName} - ${displayNames[statName]} % Increase`,
            data: sortedByLevel.map(d => d.value),
            backgroundColor: colors[statName].bg,
            borderColor: colors[statName].border,
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }]
    };
}

// Data loading and processing
function loadHeroData() {
    const heroData = {};
    heroFiles.forEach(hero => {
        if (existsSync(hero.file)) {
            heroData[hero.name] = JSON.parse(readFileSync(hero.file, 'utf8'));
        }
    });
    return heroData;
}

function processAllHeroData() {
    const heroData = loadHeroData();
    const processedData = {};
    
    Object.keys(heroData).forEach(heroName => {
        const hero = heroData[heroName];
        const stats = hero.stats;
        const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
        
        processedData[heroName] = {
            stats: {}
        };
        
        statTypes.forEach(statType => {
            const upgradeData = generateUpgradeData(stats, statType);
            if (upgradeData.length > 0) {
                const summary = generateSummaryStats(upgradeData);
                const topIncreases = getTopIncreases([...upgradeData], 3);
                const chartData = generateChartData(heroName, statType, upgradeData);
                
                processedData[heroName].stats[statType] = {
                    upgradeData,
                    summary,
                    topIncreases,
                    chartData
                };
            }
        });
    });
    
    return processedData;
}

function generateComparisonData(processedData) {
    const comparisonData = [];
    
    Object.keys(processedData).forEach(heroName => {
        const heroStats = processedData[heroName].stats;
        const row = { name: heroName };
        
        const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
        statTypes.forEach(statType => {
            if (heroStats[statType]) {
                row[`${statType}Avg`] = heroStats[statType].summary.avg;
                row[`${statType}Max`] = heroStats[statType].summary.max;
            } else {
                row[`${statType}Avg`] = 0;
                row[`${statType}Max`] = 0;
            }
        });
        
        comparisonData.push(row);
    });
    
    // Find max values for highlighting
    const maxValues = {
        damagePerSecondAvg: Math.max(...comparisonData.map(h => h.damagePerSecondAvg)),
        damagePerSecondMax: Math.max(...comparisonData.map(h => h.damagePerSecondMax)),
        hitpointsAvg: Math.max(...comparisonData.map(h => h.hitpointsAvg)),
        hitpointsMax: Math.max(...comparisonData.map(h => h.hitpointsMax)),
        healthRecoveryAvg: Math.max(...comparisonData.map(h => h.healthRecoveryAvg)),
        healthRecoveryMax: Math.max(...comparisonData.map(h => h.healthRecoveryMax))
    };
    
    return { comparisonData, maxValues };
}

// Node.js export for server-side use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePercentageIncrease,
        generateUpgradeData,
        generateSummaryStats,
        getTopIncreases,
        generateChartData,
        loadHeroData,
        processAllHeroData,
        generateComparisonData
    };
}

// Browser global export for client-side use
if (typeof window !== 'undefined') {
    window.HeroUpgradeLogic = {
        calculatePercentageIncrease,
        generateUpgradeData,
        generateSummaryStats,
        getTopIncreases,
        generateChartData,
        processAllHeroData,
        generateComparisonData
    };
}