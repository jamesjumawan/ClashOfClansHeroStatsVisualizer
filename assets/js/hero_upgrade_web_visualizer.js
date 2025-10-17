// Web-specific display logic for Hero Upgrade Visualizer
// This file handles DOM manipulation and Chart.js integration only

class HeroUpgradeWebVisualizer {
    constructor() {
        this.charts = {};
        this.processedData = null;
    }

    // Initialize with data from external sources
    async initialize() {
        try {
            // Load and process hero data using the logic module
            if (typeof window !== 'undefined' && window.HeroUpgradeLogic) {
                // Browser environment - data would be fetched from server
                await this.loadDataFromServer();
            } else {
                // Node.js environment - data loaded from files
                const logic = require('./hero_upgrade_logic');
                this.processedData = logic.processAllHeroData();
            }
            
            this.renderAll();
        } catch (error) {
            console.error('Failed to initialize visualizer:', error);
            this.showError();
        }
    }

    async loadDataFromServer() {
        // Use the browser-compatible data loading function to load real JSON data
        if (window.HeroUpgradeLogic) {
            const rawHeroData = await window.HeroUpgradeLogic.loadHeroDataFromFiles();
            
            // Process the loaded data using the real processing logic
            if (Object.keys(rawHeroData).length > 0) {
                this.processedData = window.HeroUpgradeLogic.processAllHeroData(rawHeroData);
                console.log('Loaded real hero data:', Object.keys(rawHeroData));
                console.log('Sample data check - Archer Queen level 3 health recovery:', 
                    rawHeroData['Archer Queen']?.stats?.[2]?.healthRecovery);
            } else {
                throw new Error('No hero data loaded from JSON files');
            }
        } else {
            throw new Error('HeroUpgradeLogic not available');
        }
    }

    createSampleProcessedData() {
        // Create sample data that matches the structure from hero_upgrade_logic.js
        const heroes = ['Barbarian King', 'Archer Queen', 'Minion Prince', 'Grand Warden', 'Royal Champion'];
        const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
        const processedData = {};

        heroes.forEach(heroName => {
            processedData[heroName] = { stats: {} };
            
            statTypes.forEach(statType => {
                // Generate sample upgrade data
                const upgradeData = [];
                for (let level = 2; level <= 100; level++) {
                    upgradeData.push({
                        level: level,
                        value: Math.random() * 3 + 0.5, // Random percentage between 0.5% and 3.5%
                        actualValue: 100 + level * 5,
                        previousValue: 100 + (level - 1) * 5
                    });
                }

                const summary = this.calculateSummaryFromData(upgradeData);
                const topIncreases = upgradeData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3);

                processedData[heroName].stats[statType] = {
                    upgradeData,
                    summary,
                    topIncreases,
                    chartData: this.createChartData(heroName, statType, upgradeData)
                };
            });
        });

        return processedData;
    }

    calculateSummaryFromData(data) {
        const values = data.map(d => d.value);
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        const maxLevel = data.find(d => d.value === max)?.level;
        const minLevel = data.find(d => d.value === min)?.level;
        
        return { avg, max, min, maxLevel, minLevel };
    }

    createChartData(heroName, statType, upgradeData) {
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
                label: `${heroName} - ${displayNames[statType]} % Increase`,
                data: sortedByLevel.map(d => d.value),
                backgroundColor: colors[statType].bg,
                borderColor: colors[statType].border,
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        };
    }

    renderAll() {
        this.hideLoading();
        this.renderHeroSections();
        this.renderComparisonSection();
        this.initializeAllCharts();
    }

    renderHeroSections() {
        const contentElement = document.getElementById('content');
        if (!contentElement) return;

        const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
        const statDisplayNames = ['Damage Per Second', 'Hitpoints', 'Health Recovery'];

        Object.keys(this.processedData).forEach(heroName => {
            const heroSection = document.createElement('div');
            heroSection.className = 'hero-section';
            
            const heroTitle = document.createElement('div');
            heroTitle.className = 'hero-title';
            heroTitle.textContent = heroName;
            heroSection.appendChild(heroTitle);

            const statGrid = document.createElement('div');
            statGrid.className = 'stat-grid';

            statTypes.forEach((statType, index) => {
                const heroStats = this.processedData[heroName].stats[statType];
                if (!heroStats) return;

                const chartContainer = this.createChartContainer(
                    heroName, 
                    statType, 
                    statDisplayNames[index], 
                    heroStats
                );
                statGrid.appendChild(chartContainer);
            });

            heroSection.appendChild(statGrid);
            contentElement.appendChild(heroSection);
        });
    }

    createChartContainer(heroName, statType, displayName, statsData) {
        const container = document.createElement('div');
        container.className = 'chart-container';

        const chartId = `chart_${heroName.replace(/\s+/g, '')}_${statType}`;
        
        container.innerHTML = `
            <div class="chart-title">${displayName} Percentage Increase</div>
            <div class="chart-wrapper">
                <canvas id="${chartId}"></canvas>
            </div>
            <div class="summary-stats">
                <h4>📊 Summary Statistics</h4>
                <div class="stat-item">
                    <span class="stat-label">Average Increase:</span>
                    <span class="stat-value">${statsData.summary.avg.toFixed(2)}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Highest Increase:</span>
                    <span class="stat-value">${statsData.summary.max.toFixed(2)}% (Level ${statsData.summary.maxLevel})</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Lowest Increase:</span>
                    <span class="stat-value">${statsData.summary.min.toFixed(2)}% (Level ${statsData.summary.minLevel})</span>
                </div>
                <div style="margin-top: 15px;">
                    <strong>🏆 Top 3 Increases:</strong>
                    ${statsData.topIncreases.map((inc, i) => `
                        <div class="stat-item">
                            <span class="stat-label">${i + 1}. Level ${inc.level}:</span>
                            <span class="stat-value">+${inc.value.toFixed(2)}% (${inc.previousValue} → ${inc.actualValue})</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        return container;
    }

    renderComparisonSection() {
        const contentElement = document.getElementById('content');
        if (!contentElement) return;

        const comparisonSection = document.createElement('div');
        comparisonSection.className = 'comparison-section';

        const title = document.createElement('div');
        title.className = 'comparison-title';
        title.textContent = '🔍 Cross-Hero Comparison';
        comparisonSection.appendChild(title);

        const table = this.createComparisonTable();
        comparisonSection.appendChild(table);

        const legend = this.createLegend();
        comparisonSection.appendChild(legend);

        contentElement.appendChild(comparisonSection);
    }

    createComparisonTable() {
        const table = document.createElement('table');
        table.className = 'comparison-table';

        // Create header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Hero</th>
                <th>DPS Avg %</th>
                <th>DPS Max %</th>
                <th>HP Avg %</th>
                <th>HP Max %</th>
                <th>Recovery Avg %</th>
                <th>Recovery Max %</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create body with comparison data
        const tbody = document.createElement('tbody');
        const comparisonData = this.generateComparisonTableData();
        
        comparisonData.rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${row.hero}</strong></td>
                <td class="${row.dpsAvgHighlight ? 'highlight-max' : ''}">${row.dpsAvg}</td>
                <td class="${row.dpsMaxHighlight ? 'highlight-max' : ''}">${row.dpsMax}</td>
                <td class="${row.hpAvgHighlight ? 'highlight-max' : ''}">${row.hpAvg}</td>
                <td class="${row.hpMaxHighlight ? 'highlight-max' : ''}">${row.hpMax}</td>
                <td class="${row.recoveryAvgHighlight ? 'highlight-max' : ''}">${row.recoveryAvg}</td>
                <td class="${row.recoveryMaxHighlight ? 'highlight-max' : ''}">${row.recoveryMax}</td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        return table;
    }

    generateComparisonTableData() {
        const rows = [];
        const maxValues = {};

        // Calculate max values for highlighting
        const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
        ['Avg', 'Max'].forEach(type => {
            statTypes.forEach(stat => {
                const key = `${stat}${type}`;
                maxValues[key] = Math.max(...Object.keys(this.processedData).map(hero => {
                    const heroStats = this.processedData[hero].stats[stat];
                    return heroStats ? heroStats.summary[type.toLowerCase()] : 0;
                }));
            });
        });

        // Generate rows
        Object.keys(this.processedData).forEach(heroName => {
            const heroStats = this.processedData[heroName].stats;
            
            const dpsAvg = heroStats.damagePerSecond?.summary.avg || 0;
            const dpsMax = heroStats.damagePerSecond?.summary.max || 0;
            const hpAvg = heroStats.hitpoints?.summary.avg || 0;
            const hpMax = heroStats.hitpoints?.summary.max || 0;
            const recoveryAvg = heroStats.healthRecovery?.summary.avg || 0;
            const recoveryMax = heroStats.healthRecovery?.summary.max || 0;

            rows.push({
                hero: heroName,
                dpsAvg: dpsAvg.toFixed(2) + '%',
                dpsMax: dpsMax.toFixed(2) + '%',
                hpAvg: hpAvg.toFixed(2) + '%',
                hpMax: hpMax.toFixed(2) + '%',
                recoveryAvg: recoveryAvg.toFixed(2) + '%',
                recoveryMax: recoveryMax.toFixed(2) + '%',
                dpsAvgHighlight: dpsAvg === maxValues.damagePerSecondAvg,
                dpsMaxHighlight: dpsMax === maxValues.damagePerSecondMax,
                hpAvgHighlight: hpAvg === maxValues.hitpointsAvg,
                hpMaxHighlight: hpMax === maxValues.hitpointsMax,
                recoveryAvgHighlight: recoveryAvg === maxValues.healthRecoveryAvg,
                recoveryMaxHighlight: recoveryMax === maxValues.healthRecoveryMax
            });
        });

        return { rows, maxValues };
    }

    createLegend() {
        const legend = document.createElement('div');
        legend.className = 'legend';
        legend.innerHTML = `
            <h3>📈 How to Read This Data</h3>
            <p><strong>Average %:</strong> The typical percentage increase you get per level for that stat</p>
            <p><strong>Max %:</strong> The biggest single-level percentage boost available for that stat</p>
            <p><strong>Green highlighting:</strong> The hero with the best performance in that category</p>
            <p><strong>Interactive Charts:</strong> Hover over data points to see exact values and level information</p>
            <p><strong>Strategic Tip:</strong> Focus on heroes/levels with higher percentage increases for maximum efficiency!</p>
        `;
        return legend;
    }

    initializeAllCharts() {
        Object.keys(this.processedData).forEach(heroName => {
            const statTypes = ['damagePerSecond', 'hitpoints', 'healthRecovery'];
            
            statTypes.forEach(statType => {
                const heroStats = this.processedData[heroName].stats[statType];
                if (!heroStats) return;

                const chartId = `chart_${heroName.replace(/\s+/g, '')}_${statType}`;
                const canvas = document.getElementById(chartId);
                
                if (canvas) {
                    this.createChart(canvas, heroStats.chartData, heroStats.upgradeData);
                }
            });
        });
    }

    createChart(canvas, chartData, upgradeData) {
        const ctx = canvas.getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Percentage Increase (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Hero Level'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const dataIndex = context.dataIndex;
                                const data = upgradeData[dataIndex];
                                
                                if (data) {
                                    return [
                                        `Previous Value: ${data.previousValue}`,
                                        `New Value: ${data.actualValue}`,
                                        `Increase: +${data.value.toFixed(2)}%`
                                    ];
                                }
                                return [];
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });

        this.charts[canvas.id] = chart;
    }

    hideLoading() {
        const loadingElement = document.getElementById('loading');
        const contentElement = document.getElementById('content');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (contentElement) contentElement.style.display = 'block';
    }

    showError() {
        const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'block';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Chart !== 'undefined') {
        const visualizer = new HeroUpgradeWebVisualizer();
        visualizer.initialize();
    } else {
        console.error('Chart.js library not found. Please include Chart.js before this script.');
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroUpgradeWebVisualizer;
}

// Browser-compatible Hero Upgrade Logic
// This file provides the same functionality as hero_upgrade_logic.js but without Node.js dependencies

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

// Browser-compatible data loading
async function loadHeroDataFromFiles() {
    const heroFiles = [
        { name: 'Barbarian King', file: 'data/barbarian_king_stats.json' },
        { name: 'Archer Queen', file: 'data/archer_queen_stats.json' },
        { name: 'Minion Prince', file: 'data/minion_prince_stats.json' },
        { name: 'Grand Warden', file: 'data/grand_warden_stats.json' },
        { name: 'Royal Champion', file: 'data/royal_champion_stats.json' }
    ];
    
    const heroData = {};
    
    for (const hero of heroFiles) {
        try {
            const response = await fetch(hero.file);
            if (response.ok) {
                heroData[hero.name] = await response.json();
            } else {
                console.warn(`Could not load ${hero.file}`);
            }
        } catch (error) {
            console.error(`Error loading ${hero.file}:`, error);
        }
    }
    
    return heroData;
}

function processAllHeroData(heroData) {
    const processedData = {};
    
    Object.keys(heroData).forEach(heroName => {
        const hero = heroData[heroName];
        const stats = hero.stats || [];
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

// Browser global export
window.HeroUpgradeLogic = {
    calculatePercentageIncrease,
    generateUpgradeData,
    generateSummaryStats,
    getTopIncreases,
    generateChartData,
    loadHeroDataFromFiles,
    processAllHeroData,
    generateComparisonData
};