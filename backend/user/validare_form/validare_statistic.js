let weeklyData = [];
let cityData = [];
let speciesData = [];
let dangerBehaviorData = [];

function fetchWeeklyReports() {
    fetch('/api/reports/weekly')
        .then(response => response.json())
        .then(data => {
            weeklyData = data;
            const months = data.map(item => item.month);
            const counts = data.map(item => item.count);
            Plotly.newPlot('chart-weekly', [{
                x: months,
                y: counts,
                type: 'bar'
            }], {
                title: 'Monthly Reports'
            });
        });
}

function fetchReportsByCity() {
    fetch('/api/reports/by-city')
        .then(response => response.json())
        .then(data => {
            cityData = data; // Salvăm datele
            const cities = data.map(item => item.city);
            const counts = data.map(item => item.count);
            Plotly.newPlot('chart-city', [{
                x: cities,
                y: counts,
                type: 'bar'
            }], {
                title: 'Reports by City'
            });
        });
}

function fetchReportsBySpecies() {
    fetch('/api/reports/by-species')
        .then(response => response.json())
        .then(data => {
            speciesData = data;
            const species = data.map(item => item.species);
            const counts = data.map(item => item.count);
            Plotly.newPlot('chart-species', [{
                labels: species,
                values: counts,
                type: 'pie'
            }], {
                title: 'Reports by Species',
                showlegend: false
            });
        });
}

function fetchReportsByDangerAndBehavior() {
    fetch('/api/reports/by-danger-and-behavior')
        .then(response => response.json())
        .then(data => {
            dangerBehaviorData = data; // Salvăm datele
            const dangerLevels = data.map(item => item.danger_level);
            const violenceCounts = data.map(item => item.violent);
            const rabiesCounts = data.map(item => item.rabies);
            const trainedCounts = data.map(item => item.trained);
            const vaccinatedCounts = data.map(item => item.vaccinated);
            const injuredCounts = data.map(item => item.injured);

            Plotly.newPlot('chart-danger-behavior', [
                {
                    x: dangerLevels,
                    y: violenceCounts,
                    name: 'Violent',
                    type: 'bar'
                },
                {
                    x: dangerLevels,
                    y: rabiesCounts,
                    name: 'Rabies',
                    type: 'bar'
                },
                {
                    x: dangerLevels,
                    y: trainedCounts,
                    name: 'Trained',
                    type: 'bar'
                },
                {
                    x: dangerLevels,
                    y: vaccinatedCounts,
                    name: 'Vaccinated',
                    type: 'bar'
                },
                {
                    x: dangerLevels,
                    y: injuredCounts,
                    name: 'Injured',
                    type: 'bar'
                }
            ], {
                title: 'Reports by Danger Level and Behavior',
                barmode: 'group'
            });
        });
}

function exportAsCSV(data, filename) {
    const titleKeys = Object.keys(data[0]);
    const refinedData = [];
    refinedData.push(titleKeys);

    data.forEach(item => {
        refinedData.push(Object.values(item));
    });

    let csvContent = '';
    refinedData.forEach(row => {
        csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
}

function exportAsWebP(chartId, filename) {
    Plotly.toImage(chartId, { format: 'webp', width: 800, height: 600 })
        .then(function (url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link); // Required for Firefox
            link.click();
            link.parentNode.removeChild(link);
        });
}

function exportAsSVG(chartId, filename) {
    Plotly.downloadImage(chartId, { format: 'svg', width: 800, height: 600, filename: filename });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeeklyReports();
    fetchReportsByCity();
    fetchReportsBySpecies();
    fetchReportsByDangerAndBehavior();

    document.getElementById('export-csv_weekly').addEventListener('click', () => {
        exportAsCSV(weeklyData, 'weekly_reports.csv');
    });
    document.getElementById('export-csv_city').addEventListener('click', () => {
        exportAsCSV(cityData, 'city_reports.csv');
    });
    document.getElementById('export-csv_species').addEventListener('click', () => {
        exportAsCSV(speciesData, 'species_reports.csv');
    });
    document.getElementById('export-csv_behavior').addEventListener('click', () => {
        exportAsCSV(dangerBehaviorData, 'behavior_reports.csv');
    });

    document.getElementById('export-webp_weekly').addEventListener('click', () => {
        exportAsWebP('chart-weekly', 'weekly_reports.webp');
    });
    document.getElementById('export-webp_city').addEventListener('click', () => {
        exportAsWebP('chart-city', 'city_reports.webp');
    });
    document.getElementById('export-webp_species').addEventListener('click', () => {
        exportAsWebP('chart-species', 'species_reports.webp');
    });
    document.getElementById('export-webp_behavior').addEventListener('click', () => {
        exportAsWebP('chart-danger-behavior', 'behavior_reports.webp');
    });

    document.getElementById('export-svg_weekly').addEventListener('click', () => {
        exportAsSVG('chart-weekly', 'weekly_reports.svg');
    });
    document.getElementById('export-svg_city').addEventListener('click', () => {
        exportAsSVG('chart-city', 'city_reports.svg');
    });
    document.getElementById('export-svg_species').addEventListener('click', () => {
        exportAsSVG('chart-species', 'species_reports.svg');
    });
    document.getElementById('export-svg_behavior').addEventListener('click', () => {
        exportAsSVG('chart-danger-behavior', 'behavior_reports.svg');
    });
});
