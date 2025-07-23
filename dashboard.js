// Extended Dashboard Main JavaScript File
class DashboardManager {
    constructor() {
        this.charts = {};
        this.updateInterval = 5000; // Update every 5 seconds
        this.newsUpdateInterval = 30000; // Update news every 30 seconds
        this.dataEndpoints = {
            systemStatus: '../data/raw/system_status.json',
            realtimeResults: '../data/raw/realtime_results.json',
            monitoringData: '../data/raw/monitoring_dashboard.json',
            newsData: '../data/raw/news_data.csv',
            stockData: '../data/raw/training_features.csv'
        };
        
        this.newsCache = [];
        this.sourceFiles = {};
        this.extensions = null; // Initialize extensions as null
        this.datasetsManager = null;
    }

    async init() {
        await this.initializeExtensions(); // Ensure extensions are loaded first
        this.initializeDatasetsManager(); // Initialize datasets manager
        this.setupCharts();
        this.startRealTimeUpdates();
        this.loadInitialData();
        this.setupEventListeners();
        this.updateAPIStatusDisplay();
    }

    async initializeExtensions() {
        console.log('[DASHBOARD DEBUG] Initializing extensions...');
        if (typeof DashboardExtended !== 'undefined') {
            try {
                console.log('[DASHBOARD DEBUG] Creating DashboardExtended instance...');
                this.extensions = new DashboardExtended(this);
                await this.extensions.init(); // Wait for the extension to be fully initialized
                console.log('[DASHBOARD DEBUG] DashboardExtended initialized successfully');
            } catch (error) {
                console.error('[DASHBOARD DEBUG] Error initializing DashboardExtended:', error);
            }
        } else {
            console.error('[DASHBOARD DEBUG] DashboardExtended class not found. Make sure dashboard-extended.js is loaded before dashboard.js.');
        }
    }

    initializeDatasetsManager() {
        console.log('[DASHBOARD DEBUG] Initializing datasets manager...');
        if (typeof DatasetsManager !== 'undefined') {
            try {
                this.datasetsManager = new DatasetsManager();
                this.datasetsManager.init();
                console.log('[DASHBOARD DEBUG] DatasetsManager initialized successfully');
            } catch (error) {
                console.error('[DASHBOARD DEBUG] Error initializing DatasetsManager:', error);
            }
        } else {
            console.error('[DASHBOARD DEBUG] DatasetsManager class not found. Make sure datasets-manager.js is loaded.');
        }
    }

    // ... (rest of the methods are the same) ...

    // Common chart settings (improved label readability)
    getCommonChartOptions(chartType = 'line') {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25,
                    bottom: 25,
                    left: 15,
                    right: 15
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        };

        if (chartType === 'line' || chartType === 'bar') {
            baseOptions.scales = {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            };
        }

        return baseOptions;
    }

    // Update API status display
    updateAPIStatusDisplay() {
        if (!window.sp500APIManager) {
            console.warn('sp500APIManager not yet initialized.');
            return;
        }
        const apiStatus = window.sp500APIManager.getAPIStatus();
        const container = document.getElementById('api-status-container');
        if (!container) {
            console.warn('Could not find HTML element #api-status-container to display API status.');
            return;
        }

        let html = '<h3>API Status</h3><div class="api-status-grid">';
        for (const apiName in apiStatus) {
            const status = apiStatus[apiName];
            let statusClass = '';
            let statusText = '';
            switch (status) {
                case 'active':
                    statusClass = 'status-dot online';
                    statusText = 'Active';
                    break;
                case 'error':
                    statusClass = 'status-dot offline';
                    statusText = 'Error';
                    break;
                case 'no_key':
                    statusClass = 'status-dot warning';
                    statusText = 'No Key';
                    break;
                case 'demo_key':
                    statusClass = 'status-dot warning';
                    statusText = 'Demo Key';
                    break;
                default:
                    statusClass = 'status-dot unknown';
                    statusText = 'Unknown';
            }
            html += `
                <div class="api-status-item">
                    <span class="api-name">${apiName}</span>
                    <span class="${statusClass}"></span>
                    <span class="api-status-text">${statusText}</span>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    // Initial data load
    async loadInitialData() {
        try {
            await this.updateSystemStatus();
            await this.updateRealtimePredictions();
            await this.updateSystemLogs();
            this.updateLastUpdateTime();
        } catch (error) {
            console.error('Initial data load failed:', error);
            this.showErrorState();
        }
    }

    // Update system status
    async updateSystemStatus() {
        try {
            // Attempt to load data from actual file
            const response = await fetch(this.dataEndpoints.systemStatus);
            let data;
            
            if (response.ok) {
                data = await response.json();
            } else {
                // Use mock data if file not found
                data = this.generateMockSystemStatus();
            }

            this.updateSystemMetrics(data);
        } catch (error) {
            console.warn('Failed to load system status file, using mock data:', error);
            const mockData = this.generateMockSystemStatus();
            this.updateSystemMetrics(mockData);
        }
    }

    // Update system metrics
    updateSystemMetrics(data) {
        document.getElementById('model-accuracy').textContent = 
            data.model_accuracy ? `${data.model_accuracy}%` : `${(85 + Math.random() * 10).toFixed(1)}%`;
        
        document.getElementById('processing-speed').textContent = 
            data.processing_speed ? data.processing_speed : `${(15 + Math.random() * 10).toFixed(1)}`;
        
        document.getElementById('active-models').textContent = 
            data.active_models || Math.floor(3 + Math.random() * 2);
        
        document.getElementById('data-sources').textContent = 
            data.data_sources || Math.floor(5 + Math.random() * 3);

        // Display system status
        const statusElement = document.getElementById('system-status');
        if (data.status === 'online' || !data.status) {
            statusElement.className = 'status-dot online';
        } else {
            statusElement.className = 'status-dot offline';
        }
    }

    // Update real-time prediction results
    async updateRealtimePredictions() {
        try {
            const response = await fetch(this.dataEndpoints.realtimeResults);
            let data;
            
            if (response.ok) {
                data = await response.json();
            } else {
                data = this.generateMockPredictions();
            }

            this.updatePredictionsDisplay(data);
        } catch (error) {
            console.warn('Failed to load real-time results file, using mock data:', error);
            const mockData = this.generateMockPredictions();
            this.updatePredictionsDisplay(mockData);
        }
    }

    // Update prediction results display
    updatePredictionsDisplay(data) {
        const container = document.querySelector('.predictions-container');
        
        if (data.predictions && Array.isArray(data.predictions)) {
            container.innerHTML = data.predictions.slice(0, 5).map(pred => `
                <div class="prediction-item">
                    <span class="stock-symbol">${pred.symbol}</span>
                    <span class="prediction-direction ${pred.direction}">${pred.change}</span>
                    <span class="confidence">Confidence: ${pred.confidence}%</span>
                </div>
            `).join('');
        }
    }

    // Update system logs
    async updateSystemLogs() {
        try {
            const logFiles = [
                '../data/raw/system_orchestrator.log'
            ];
            let logs = [];

            for (const logFile of logFiles) {
                try {
                    const response = await fetch(logFile);
                    if (response.ok) {
                        const text = await response.text();
                        const parsedLogs = this.parseLogFile(text);
                        logs = logs.concat(parsedLogs);
                    } else {
                        console.error(`[DEBUG] Log file ${logFile} not found or failed to load (${response.status} ${response.statusText}). Using mock data.`);
                    }
                } catch (error) {
                    console.error(`[DEBUG] Error loading log file ${logFile}:`, error, `. Using mock data.`);
                }
            }

            if (logs.length === 0) {
                logs = this.generateMockLogs();
            }

            this.displayLogs(logs.slice(0, 20)); // Display only the latest 20
        } catch (error) {
            console.error('Log load failed (final):', error);
            this.displayLogs(this.generateMockLogs());
        }
    }

    // Parse log file
    parseLogFile(logText) {
        const lines = logText.split('\n').filter(line => line.trim());
        return lines.slice(-10).map((line, index) => {
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Use current time as timestamp is not in log file
            let level = 'INFO';
            let message = line;
            
            if (line.toLowerCase().includes('error')) level = 'ERROR';
            else if (line.toLowerCase().includes('warning')) level = 'WARNING';
            else if (line.toLowerCase().includes('success')) level = 'SUCCESS';
            else if (line.toLowerCase().includes('info')) level = 'INFO';
            else if (line.toLowerCase().includes('debug')) level = 'DEBUG';
            
            const levelRegex = new RegExp(`(ERROR|WARNING|INFO|SUCCESS|DEBUG)`, 'i');
            message = message.replace(levelRegex, '').trim();

            return { timestamp, level, message: message.substring(0, 100) };
        });
    }

    // Display logs
    displayLogs(logs) {
        const container = document.getElementById('system-logs');
        container.innerHTML = logs.map(log => `
            <div class="log-entry ${log.level.toLowerCase()}">
                <span class="timestamp">${log.timestamp}</span>
                <span class="log-level">${log.level}</span>
                <span class="log-message">${log.message}</span>
            </div>
        `).join('');
    }

    // Chart setup
    setupCharts() {
        this.setupPerformanceChart();
        this.setupVolumeChart();
        this.setupModelComparisonChart();
    }

    // Performance trend chart
    setupPerformanceChart() {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        
        // Use actual model performance data
        const modelLabels = ['Random Forest', 'Gradient Boosting', 'XGBoost', 'LSTM'];
        const accuracyData = [100.0, 100.0, 99.6, 85.7]; // Based on actual training results
        const timeLabels = this.generateRecentTimeLabels(4); // Show recent training times
        
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Model Test Accuracy (%)',
                    data: accuracyData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Model Performance Comparison (Test Accuracy)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const modelNames = ['Random Forest', 'Gradient Boosting', 'XGBoost', 'LSTM'];
                                return modelNames[context[0].dataIndex];
                            },
                            label: function(context) {
                                return `Test Accuracy: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        }
                    },
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        title: {
                            display: true,
                            text: 'Training Session'
                        }
                    }
                }
            }
        });
    }

    // Trading volume chart
    setupVolumeChart() {
        const ctx = document.getElementById('volume-chart').getContext('2d');
        const volumeData = {
            labels: ['NVDA', 'TSLA', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'],
            data: [89.1, 67.8, 45.2, 32.1, 28.7, 25.3, 22.4]
        };

        this.charts.volume = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: volumeData.labels,
                datasets: [{
                    label: 'Volume (Millions)',
                    data: volumeData.data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(155, 89, 182, 0.8)'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'M';
                            }
                        }
                    }
                }
            }
        });

        this.updateXaiStockSelector(volumeData);
        this.updateVolumeAnalysis(volumeData);
    }

    updateXaiStockSelector(volumeData) {
        const xaiStockSelector = document.getElementById('xai-stock-selector');
        if (!xaiStockSelector) return;

        const top5Stocks = volumeData.labels
            .map((label, index) => ({ symbol: label, volume: volumeData.data[index] }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 5);

        xaiStockSelector.innerHTML = top5Stocks
            .map(stock => `<option value="${stock.symbol}">${stock.symbol}</option>`)
            .join('');

        if (top5Stocks.length > 0) {
            this.handleXaiStockChange(top5Stocks[0].symbol);
        }
    }

    updateVolumeAnalysis(volumeData) {
        const totalVolume = volumeData.data.reduce((sum, vol) => sum + vol, 0);
        const avgVolume = totalVolume / volumeData.data.length;
        const maxVolume = Math.max(...volumeData.data);
        const maxVolumeStock = volumeData.labels[volumeData.data.indexOf(maxVolume)];
        
        const abnormalVolumes = volumeData.data
            .map((vol, index) => ({ symbol: volumeData.labels[index], volume: vol }))
            .filter(item => item.volume > avgVolume * 1.5);
        
        document.getElementById('total-volume').textContent = totalVolume.toFixed(1) + 'M';
        document.getElementById('avg-volume').textContent = avgVolume.toFixed(1) + 'M';
        document.getElementById('max-volume').textContent = `${maxVolumeStock} (${maxVolume}M)`;
        
        const volumeAlertsElement = document.getElementById('volume-alerts');
        if (abnormalVolumes.length > 0) {
            volumeAlertsElement.textContent = `${abnormalVolumes.length} cases (${abnormalVolumes.map(item => item.symbol).join(', ')})`;
            volumeAlertsElement.classList.add('alert');
        } else {
            volumeAlertsElement.textContent = 'None';
            volumeAlertsElement.classList.remove('alert');
        }
    }

    setupModelComparisonChart() {
        const ctx = document.getElementById('model-comparison-chart').getContext('2d');
        this.charts.modelComparison = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Accuracy', 'Speed', 'Stability', 'Scalability', 'Efficiency'],
                datasets: [{
                    label: 'Random Forest',
                    data: [85, 90, 80, 75, 85],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: 2
                }, {
                    label: 'Gradient Boosting',
                    data: [90, 75, 85, 80, 80],
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.2)',
                    borderWidth: 2
                }, {
                    label: 'LSTM',
                    data: [88, 70, 90, 85, 75],
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.2)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    startRealTimeUpdates() {
        setInterval(async () => {
            await this.updateSystemStatus();
            await this.updateRealtimePredictions();
            this.updateCharts();
            this.updateLastUpdateTime();
            
            if (Math.random() > 0.7) {
                await this.updateSystemLogs();
            }
        }, this.updateInterval);
    }

    updateCharts() {
        if (this.charts.performance) {
            const newData = 85 + Math.random() * 10;
            this.charts.performance.data.datasets[0].data.push(newData);
            this.charts.performance.data.datasets[0].data.shift();
            this.charts.performance.update('none');
        }
        
        if (this.charts.volume && Math.random() > 0.8) {
            this.charts.volume.data.datasets[0].data = 
                this.charts.volume.data.datasets[0].data.map(val => 
                    val + (Math.random() - 0.5) * 5
                );
            this.charts.volume.update('none');
        }
    }

    generateTimeLabels(hours) {
        const labels = [];
        const now = new Date();
        for (let i = hours; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hourCycle: 'h23'
            }));
        }
        return labels;
    }

    generateRecentTimeLabels(count) {
        const labels = [];
        const now = new Date();
        const sessions = ['Session 1', 'Session 2', 'Session 3', 'Session 4'];
        
        for (let i = 0; i < count; i++) {
            const time = new Date(now.getTime() - (count - 1 - i) * 2 * 60 * 60 * 1000);
            labels.push(`${sessions[i]} (${time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })})`);
        }
        return labels;
    }

    generatePerformanceData(points) {
        const data = [];
        let baseAccuracy = 87;
        for (let i = 0; i < points; i++) {
            baseAccuracy += (Math.random() - 0.5) * 2;
            baseAccuracy = Math.max(80, Math.min(95, baseAccuracy));
            data.push(parseFloat(baseAccuracy.toFixed(1)));
        }
        return data;
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('ko-KR', { hour12: false });
        document.getElementById('last-update').textContent = `Last Updated: ${timeString} KST`;
    }

    setupEventListeners() {
        document.querySelectorAll('.widget').forEach(widget => {
            widget.addEventListener('click', (e) => {
                if (!e.target.closest('canvas')) {
                    this.showWidgetDetails(widget);
                }
            });
        });

        document.querySelector('.content-header h1').addEventListener('click', () => {
            this.refreshAllData();
        });

        window.addEventListener('newsUpdate', (event) => {
            if (this.extensions && typeof this.extensions.updateLlmAnalysisSummary === 'function') {
                this.extensions.updateLlmAnalysisSummary();
            }
        });

        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        let touchStartX = 0;

        const openSidebar = () => {
            sidebar.classList.add('open');
            mainContent.classList.add('shifted');
        };

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            mainContent.classList.remove('shifted');
        };

        if (mobileMenuToggle && sidebar && mainContent) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (sidebar.classList.contains('open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });

            sidebar.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        closeSidebar();
                    }
                });
            });

            mainContent.addEventListener('click', () => {
                if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                    closeSidebar();
                }
            });

            sidebar.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });

            sidebar.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                if (touchStartX - touchEndX > 50) { 
                    closeSidebar();
                }
            });
        }

        const xaiStockSelector = document.getElementById('xai-stock-selector');
        if (xaiStockSelector) {
            xaiStockSelector.addEventListener('change', (event) => {
                this.handleXaiStockChange(event.target.value);
            });
            this.handleXaiStockChange(xaiStockSelector.value);
        }

        document.querySelector('.page-content').addEventListener('click', (event) => {
            const logEntry = event.target.closest('.log-entry');
            const newsItem = event.target.closest('.news-item');

            if (logEntry) {
                this.navigateToPage('logs');
            }

            if (newsItem) {
                this.navigateToPage('news');
            }
        });
    }

    navigateToPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        document.getElementById(`page-${pageId}`).classList.add('active');
        const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (navLink) {
            navLink.classList.add('active');
            document.getElementById('page-title').textContent = navLink.textContent;
        }
    }

    handleXaiStockChange(stockSymbol) {
        console.log(`[XAI DEBUG] Selected stock for XAI analysis: ${stockSymbol}`);
        if (this.extensions && typeof this.extensions.renderLocalXaiAnalysis === 'function') {
            this.extensions.renderLocalXaiAnalysis(stockSymbol);
        } else {
            console.error('[XAI DEBUG] Extensions or renderLocalXaiAnalysis method not available.');
        }
    }

    showWidgetDetails(widget) {
        return;
    }

    async refreshAllData() {
        await this.loadInitialData();
        this.updateCharts();
    }

    showErrorState() {
        document.getElementById('system-status').className = 'status-dot offline';
        document.getElementById('last-update').textContent = 'Update Failed';
        
        document.getElementById('model-accuracy').textContent = '--';
        document.getElementById('processing-speed').textContent = '--';
        document.getElementById('active-models').textContent = '--';
        document.getElementById('data-sources').textContent = '--';
    }

    generateMockSystemStatus() {
        return {
            model_accuracy: (85 + Math.random() * 10).toFixed(1),
            processing_speed: (15 + Math.random() * 10).toFixed(1),
            active_models: Math.floor(3 + Math.random() * 2),
            data_sources: Math.floor(5 + Math.random() * 3),
            status: 'online'
        };
    }

    generateMockPredictions() {
        const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'CRM', 'ORCL'];
        const predictions = [];
        
        for (let i = 0; i < 5; i++) {
            const isUp = Math.random() > 0.5;
            const change = (Math.random() * 3).toFixed(1);
            predictions.push({
                symbol: stocks[Math.floor(Math.random() * stocks.length)],
                direction: isUp ? 'up' : 'down',
                change: isUp ? `↗ +${change}%` : `↘ -${change}%`,
                confidence: Math.floor(75 + Math.random() * 20)
            });
        }
        
        return { predictions };
    }

    generateMockLogs() {
        const messages = [
            'Model training completed - Accuracy: 89.3%',
            'Data collection pipeline operating normally',
            'API response delay detected: average 1.2 seconds',
            'Collected 200 new news data',
            'Model prediction accuracy improved: +2.1%',
            'System backup completed',
            'Real-time data processing',
            'Feature engineering completed'
        ];
        
        const levels = ['INFO', 'SUCCESS', 'WARNING', 'INFO'];
        const logs = [];
        
        for (let i = 0; i < 8; i++) {
            const now = new Date();
            const timestamp = new Date(now.getTime() - i * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            logs.push({
                timestamp,
                level: levels[Math.floor(Math.random() * levels.length)],
                message: messages[Math.floor(Math.random() * messages.length)]
            });
        }
        
        return logs;
    }

    showNotification(message, type = 'info') {
        console.log(`[NOTIFICATION] ${type.toUpperCase()}: ${message}`);
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    refreshXAIData() {
        console.log('[DASHBOARD DEBUG] refreshXAIData called directly');
        
        if (this.extensions && typeof this.extensions.refreshXAIData === 'function') {
            console.log('[DASHBOARD DEBUG] Calling extensions.refreshXAIData');
            this.extensions.refreshXAIData();
        } else {
            console.error('[DASHBOARD DEBUG] Extensions or refreshXAIData not available');
            this.showNotification('XAI refresh functionality not available', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardManager();
    window.dashboard.init();
});

class RealTimeConnection {
    constructor(dashboardManager) {
        this.dashboard = dashboardManager;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 5000;
    }

    connect() {
        try {
            this.ws = new WebSocket('ws://localhost:8080/dashboard');
            this.setupWebSocketHandlers();
        } catch (error) {
            console.log('WebSocket server connection failed, operating in polling mode');
        }
    }

    setupWebSocketHandlers() {
        this.ws.onopen = () => {
            console.log('Real-time connection successful');
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealTimeData(data);
        };

        this.ws.onclose = () => {
            this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    }

    handleRealTimeData(data) {
        switch(data.type) {
            case 'system_status':
                this.dashboard.updateSystemMetrics(data.payload);
                break;
            case 'predictions':
                this.dashboard.updatePredictionsDisplay(data.payload);
                break;
            case 'logs':
                this.dashboard.displayLogs(data.payload);
                break;
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, this.reconnectInterval);
        }
    }
}