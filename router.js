// SPA Router Class
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = 'dashboard';
        this.tabInstances = {};
        this.init();
    }

    init() {
        // Page title mapping
        this.pageTitles = {
            'dashboard': 'Dashboard',
            'overview': 'System Overview',
            'models': 'Model Performance',
            'predictions': 'Real-time Predictions',
            'news': 'News Analysis',
            'data': 'Data Explorer',
            'datasets': 'Datasets',
            'code': 'Source Code',
            'logs': 'System Logs',
            'settings': 'Settings',
            'xai': 'XAI Analysis',
            'model-training': 'Model Training',
            'progress': 'Progress'
        };

        // Set up navigation click events
        this.setupNavigation();
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });

        // Initial page load
        const initialPage = this.getPageFromHash() || 'dashboard';
        this.navigateTo(initialPage, false);
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page, updateHistory = true) {
        console.log(`Navigating to page: ${page}`);
        // 현재 활성 페이지 숨기기
        const currentPageElement = document.querySelector('.page.active');
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
            console.log(`Removed active class from: ${currentPageElement.id}`);
        }

        // 새 페이지 표시
        const newPageElement = document.getElementById(`page-${page}`);
        if (newPageElement) {
            newPageElement.classList.add('active');
            console.log(`Added active class to: ${newPageElement.id}`);
        }

        // 네비게이션 활성 상태 업데이트
        this.updateActiveNavigation(page);

        // 페이지 타이틀 업데이트
        this.updatePageTitle(page);

        // URL 업데이트
        if (updateHistory) {
            window.history.pushState({ page }, '', `#${page}`);
            console.log(`URL updated to: #${page}`);
        }

        // 페이지별 초기화 실행
        this.initializePage(page);

        this.currentPage = page;
        console.log(`Current page set to: ${this.currentPage}`);
    }

    updateActiveNavigation(page) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
    }

    updatePageTitle(page) {
        const title = this.pageTitles[page] || 'Dashboard';
        document.getElementById('page-title').textContent = title;
        document.title = `AI Stock Prediction System - ${title}`;
    }

    getPageFromHash() {
        const hash = window.location.hash.substring(1);
        return hash || null;
    }

    async initializePage(page) {
        console.log(`Initializing page: ${page}`);
        switch(page) {
            case 'dashboard':
                await this.initializeDashboardPage();
                break;
            case 'overview':
                this.initializeOverviewPage();
                break;
            case 'models':
                this.initializeModelsPage();
                break;
            case 'model-training':
                await this.initializeModelTrainingPage();
                break;
            case 'predictions':
                await this.initializePredictionsPage();
                break;
            case 'news':
                await this.initializeNewsPage();
                break;
            case 'data':
                this.initializeDataPage();
                break;
            case 'code':
                this.initializeCodePage();
                break;
            case 'logs':
                this.initializeLogsPage();
                break;
            case 'settings':
                this.initializeSettingsPage();
                break;
            case 'xai':
                await this.initializeXAIPage();
                break;
            case 'progress':
                console.log('[ROUTER] 🚀 Progress case triggered!');
                await this.initializeProgressPage();
                console.log('[ROUTER] 🚀 Progress page initialization completed!');
                break;
            case 'datasets':
                await this.initializeDatasetsPage();
                break;
        }
    }

    async initializeDashboardPage() {
        console.log('[ROUTER] Initializing dashboard page with modular approach');
        if (!this.tabInstances.dashboard) {
            if (window.DashboardTab) {
                this.tabInstances.dashboard = new window.DashboardTab();
            } else {
                console.warn('[ROUTER] DashboardTab class not available, falling back to legacy dashboard');
                if (window.dashboard) {
                    window.dashboard.refreshAllData();
                }
                return;
            }
        }
        await this.tabInstances.dashboard.init();
    }

    initializeOverviewPage() {
        console.log('[ROUTER] Initializing system overview page');
        
        // System Overview는 정적 콘텐츠이므로 특별한 초기화가 필요하지 않음
        // 모든 데이터는 HTML에 하드코딩되어 있음
        
        // 애니메이션 효과 추가
        const overviewPage = document.getElementById('page-overview');
        if (overviewPage) {
            const widgets = overviewPage.querySelectorAll('.widget');
            widgets.forEach((widget, index) => {
                widget.style.opacity = '0';
                widget.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    widget.style.transition = 'all 0.5s ease';
                    widget.style.opacity = '1';
                    widget.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
        
        console.log('[ROUTER] System overview page initialized with animation effects');
    }

    async initializeModelTrainingPage() {
        console.log('[ROUTER] Initializing model training page with modular approach');
        if (!this.tabInstances.modelTraining) {
            if (window.ModelTrainingTab) {
                this.tabInstances.modelTraining = new window.ModelTrainingTab();
                // Store global reference for button functions
                window.modelTrainingTab = this.tabInstances.modelTraining;
            } else {
                console.warn('[ROUTER] ModelTrainingTab class not available, falling back to legacy');
                this.initializeModelsPage(); // Use existing legacy function as fallback
                return;
            }
        }
        await this.tabInstances.modelTraining.init();
    }

    initializeModelsPage() {
        console.log('initializeModelsPage called');
        // Create model performance table
        const tableBody = document.getElementById('model-performance-table');
        if (tableBody) {
            const models = [
                {
                    name: 'Random Forest',
                    accuracy: 0.873,
                    precision: 0.856,
                    recall: 0.891,
                    f1Score: 0.873,
                    processingTime: 0.145,
                    status: 'Active'
                },
                {
                    name: 'Gradient Boosting',
                    accuracy: 0.912,
                    precision: 0.895,
                    recall: 0.928,
                    f1Score: 0.911,
                    processingTime: 0.234,
                    status: 'Active'
                },
                {
                    name: 'LSTM',
                    accuracy: 0.887,
                    precision: 0.872,
                    recall: 0.903,
                    f1Score: 0.887,
                    processingTime: 1.456,
                    status: 'Standby'
                }
            ];

            tableBody.innerHTML = models.map(model => `
                <tr>
                    <td><strong>${model.name}</strong></td>
                    <td>${(model.accuracy * 100).toFixed(1)}%</td>
                    <td>${(model.precision * 100).toFixed(1)}%</td>
                    <td>${(model.recall * 100).toFixed(1)}%</td>
                    <td>${(model.f1Score * 100).toFixed(1)}%</td>
                    <td>${model.processingTime} seconds</td>
                    <td><span class="status-badge ${model.status === 'Active' ? 'active' : 'inactive'}">${model.status}</span></td>
                </tr>
            `).join('');
        }

        // Display model architecture
        this.displayModelArchitecture();
        
        // Display hyperparameters
        this.displayHyperparameters();
    }

    displayModelArchitecture() {
        const container = document.getElementById('model-architecture');
        if (container) {
            container.innerHTML = `
                <div class="architecture-item">
                    <h4>Random Forest</h4>
                    <ul>
                        <li>Number of Trees: 100</li>
                        <li>Max Depth: 15</li>
                        <li>Feature Selection: sqrt</li>
                    </ul>
                </div>
                <div class="architecture-item">
                    <h4>Gradient Boosting</h4>
                    <ul>
                        <li>Learning Rate: 0.1</li>
                        <li>Number of Trees: 200</li>
                        <li>Max Depth: 8</li>
                    </ul>
                </div>
                <div class="architecture-item">
                    <h4>LSTM</h4>
                    <ul>
                        <li>Hidden Layers: 128</li>
                        <li>Sequence Length: 30</li>
                        <li>Dropout: 0.2</li>
                    </ul>
                </div>
            `;
        }
    }

    displayHyperparameters() {
        const container = document.getElementById('hyperparameters');
        if (container) {
            container.innerHTML = `
                <div class="param-group">
                    <h4>Common Settings</h4>
                    <div class="param-item">
                        <span>Validation Split:</span>
                        <span>0.2</span>
                    </div>
                    <div class="param-item">
                        <span>Random Seed:</span>
                        <span>42</span>
                    </div>
                    <div class="param-item">
                        <span>Cross-Validation:</span>
                        <span>5-Fold</span>
                    </div>
                </div>
            `;
        }
    }

    async initializePredictionsPage() {
        console.log('[ROUTER] Initializing predictions page with modular approach');
        if (!this.tabInstances.predictions) {
            if (window.PredictionsTab) {
                this.tabInstances.predictions = new window.PredictionsTab();
                // Store global reference for pagination functions
                window.predictionsTab = this.tabInstances.predictions;
            } else {
                console.warn('[ROUTER] PredictionsTab class not available, falling back to legacy');
                this.initializePredictionsPageLegacy();
                return;
            }
        }
        await this.tabInstances.predictions.init();
    }

    initializePredictionsPageLegacy() {
        console.log('initializePredictionsPage called (legacy)');
        // Initialize prediction chart
        this.initializePredictionChart();
        
        // Create confidence meters
        this.createConfidenceMeters();
        
        // Update prediction results table
        this.updatePredictionsTable();
        
        // Add event listener for stock selector
        this.setupPredictionStockSelector();
    }

    initializePredictionChart(stockSymbol = 'AAPL') {
        const ctx = document.getElementById('prediction-chart');
        if (ctx && ctx.getContext) {
            // Destroy existing chart if it exists
            if (this.predictionChart) {
                this.predictionChart.destroy();
            }
            
            this.predictionChart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: this.generateTimeLabels(20),
                    datasets: [{
                        label: `${stockSymbol} Actual Price`,
                        data: this.generateMockPriceData(20, stockSymbol),
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true
                    }, {
                        label: `${stockSymbol} Predicted Price`,
                        data: this.generateMockPriceData(20, stockSymbol, 5),
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        fill: false,
                        borderDash: [5, 5]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    layout: {
                        padding: {
                            top: 10,
                            right: 10,
                            bottom: 10,
                            left: 10
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        y: {
                            beginAtZero: false,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                boxWidth: 12,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white'
                        }
                    }
                }
            });
        }
    }

    createConfidenceMeters() {
        const container = document.getElementById('confidence-meters');
        if (container) {
            const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
            container.innerHTML = stocks.map(stock => {
                const confidence = Math.floor(Math.random() * 30) + 70;
                return `
                    <div class="confidence-meter">
                        <div class="meter-header">
                            <span class="stock-name">${stock}</span>
                            <span class="confidence-value">${confidence}%</span>
                        </div>
                        <div class="meter-bar">
                            <div class="meter-fill" style="width: ${confidence}%; background-color: ${this.getConfidenceColor(confidence)}"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    getConfidenceColor(confidence) {
        if (confidence >= 80) return '#27ae60';
        if (confidence >= 60) return '#f39c12';
        return '#e74c3c';
    }

    updatePredictionsTable() {
        const tbody = document.getElementById('predictions-table-body');
        if (tbody) {
            const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
            tbody.innerHTML = stocks.map(stock => {
                const currentPrice = (Math.random() * 200 + 100).toFixed(2);
                const predictedPrice = (parseFloat(currentPrice) * (0.98 + Math.random() * 0.04)).toFixed(2);
                const change = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2);
                const confidence = Math.floor(Math.random() * 30) + 70;
                
                return `
                    <tr>
                        <td><strong>${stock}</strong></td>
                        <td>$${currentPrice}</td>
                        <td>$${predictedPrice}</td>
                        <td class="${change > 0 ? 'positive' : 'negative'}">${change > 0 ? '+' : ''}${change}%</td>
                        <td>${confidence}%</td>
                        <td>${new Date().toLocaleTimeString()}</td>
                    </tr>
                `;
            }).join('');
        }
    }

    async initializeNewsPage() {
        console.log('[ROUTER] Initializing news page with modular approach');
        if (!this.tabInstances.news) {
            if (window.NewsTab) {
                this.tabInstances.news = new window.NewsTab();
            } else {
                console.warn('[ROUTER] NewsTab class not available, falling back to legacy');
                this.initializeNewsPageLegacy();
                return;
            }
        }
        await this.tabInstances.news.init();
    }

    async initializeNewsPageLegacy() {
        console.log('initializeNewsPage called (legacy)');
        // Use real-time news analyzer
        if (window.newsAnalyzer) {
            // Load real-time news
            const latestNews = window.newsAnalyzer.getLatestNews(15);
            const newsSummary = window.newsAnalyzer.generateNewsSummary();
            
            // Update sentiment analysis chart (using real data)
            this.initializeSentimentChart(newsSummary.sentimentBreakdown);
            
            // Update news feed (using real news)
            this.updateNewsFeed(latestNews);
            
            // Update news summary (using real analysis results)
            this.updateNewsSummary(newsSummary);
            
            // Set up news update event listener
            window.addEventListener('newsUpdate', (event) => {
                const { news } = event.detail;
                const summary = window.newsAnalyzer.generateNewsSummary();
                
                this.updateNewsFeed(news.slice(0, 15));
                this.updateNewsSummary(summary);
                this.updateSentimentChart(summary.sentimentBreakdown);
                
                // Display notification
                if (window.dashboard && window.dashboard.extensions) {
                    window.dashboard.extensions.showNotification(
                        `${news.length} new news articles analyzed.`, 
                        'info'
                    );
                }
            });
        } else {
            // Fallback: Use existing mock data
            this.initializeSentimentChart();
            this.updateNewsFeed();
            this.updateNewsSummary();
        }
    }

    initializeSentimentChart(sentimentData = null) {
        const ctx = document.getElementById('sentiment-chart');
        if (ctx && ctx.getContext) {
            // 실제 데이터가 있으면 사용, 없으면 기본값
            const data = sentimentData ? [
                sentimentData.positive || 0,
                sentimentData.neutral || 0, 
                sentimentData.negative || 0
            ] : [45, 35, 20];
            
            // 기존 차트가 있으면 제거
            if (this.sentimentChart) {
                this.sentimentChart.destroy();
            }
            
            this.sentimentChart = new Chart(ctx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Positive', 'Neutral', 'Negative'],
                    datasets: [{
                        data: data,
                        backgroundColor: ['#27ae60', '#3498db', '#e74c3c'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                                    return `${context.label}: ${context.raw} items (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    updateSentimentChart(sentimentData) {
        if (this.sentimentChart && sentimentData) {
            const data = [
                sentimentData.positive || 0,
                sentimentData.neutral || 0, 
                sentimentData.negative || 0
            ];
            
            this.sentimentChart.data.datasets[0].data = data;
            this.sentimentChart.update();
        }
    }

    updateNewsFeed(newsData = null) {
        const container = document.getElementById('news-feed');
        if (container) {
            let newsToDisplay = newsData;
            
            // If no real news data, use mock data
            if (!newsToDisplay || newsToDisplay.length === 0) {
                newsToDisplay = [
                    {
                        title: 'Fed Interest Rate Hike Decision, Market Reaction?',
                        content: 'The Federal Reserve raised its benchmark interest rate by 0.25 percentage points, showing its commitment to curbing inflation.',
                        sentiment: 'negative',
                        publishedAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
                        source: 'Reuters',
                        importance: 0.8,
                        url: '#'
                    },
                    {
                        title: 'Apple Announces New iPhone Models',
                        content: 'Apple has unveiled a new iPhone series with innovative features.',
                        sentiment: 'positive',
                        publishedAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
                        source: 'Bloomberg',
                        importance: 0.7,
                        url: '#'
                    },
                    {
                        title: 'Tesla Q3 Earnings Announcement',
                        content: 'Tesla announced better-than-expected Q3 earnings, causing its stock price to surge.',
                        sentiment: 'positive',
                        publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                        source: 'CNBC',
                        importance: 0.9,
                        url: '#'
                    }
                ];
            }

            container.innerHTML = newsToDisplay.map(news => {
                const timeAgo = this.getTimeAgo(news.publishedAt);
                const sentimentText = this.getSentimentText(news.sentiment);
                const importanceIndicator = this.getImportanceIndicator(news.importance || 0.5);
                
                return `
                    <div class="news-item" data-importance="${news.importance || 0.5}">
                        <div class="news-header">
                            <div class="news-title" onclick="window.open('${news.url}', '_blank')">${news.title}</div>
                            ${importanceIndicator}
                        </div>
                        <div class="news-summary">${news.content || news.summary || ''}</div>
                        <div class="news-meta">
                            <span class="news-source">${news.source} · ${timeAgo}</span>
                            <span class="sentiment-badge sentiment-${news.sentiment}">
                                ${sentimentText}
                            </span>
                            ${news.confidence ? `<span class="confidence-badge">Confidence: ${Math.round(news.confidence * 100)}%</span>` : ''}
                        </div>
                        ${news.keywords && news.keywords.length > 0 ? `
                            <div class="news-keywords">
                                ${news.keywords.slice(0, 3).map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
            
            // Set up news filtering events
            this.setupNewsFiltering();
        }
    }

    updateNewsSummary(summaryData = null) {
        const container = document.getElementById('news-summary');
        if (container) {
            let summaries;
            
            if (summaryData && summaryData.keyTrends) {
                // Use actual analysis data
                const marketImpactText = this.getMarketImpactText(summaryData.marketImpact);
                const topTrends = summaryData.keyTrends.slice(0, 5).map(trend => trend.keyword).join(', ');
                const totalNews = summaryData.totalNews || 0;
                const sentimentInfo = this.getSentimentSummary(summaryData.sentimentBreakdown);
                
                summaries = [
                    {
                        title: 'News Analysis Status',
                        content: `Analyzed ${totalNews} news articles. ${sentimentInfo}`
                    },
                    {
                        title: 'Key Trend Keywords',
                        content: topTrends ? `${topTrends} are emerging as key interests.` : 'News on various topics is being reported evenly.'
                    },
                    {
                        title: 'Market Impact Assessment',
                        content: marketImpactText
                    },
                    {
                        title: 'Update Information',
                        content: `Last Analysis: ${summaryData.lastUpdate ? new Date(summaryData.lastUpdate).toLocaleTimeString('en-US') : 'Unknown'}`
                    }
                ];
            } else {
                // Default summary information
                summaries = [
                    {
                        title: 'Key Trends',
                        content: 'Today, the market experienced increased volatility due to the Fed\'s interest rate hike decision. Technology stocks are declining, but the energy sector maintains an upward trend.'
                    },
                    {
                        title: 'High Impact News',
                        content: 'Tesla\'s Q3 earnings announcement and Apple\'s new product launch are positively impacting the market.'
                    },
                    {
                        title: 'Market Outlook',
                        content: 'Experts anticipate continued volatility in the short term but foresee stable growth in the long term.'
                    }
                ];
            }

            container.innerHTML = summaries.map(summary => `
                <div class="summary-item">
                    <h4>${summary.title}</h4>
                    <p>${summary.content}</p>
                </div>
            `).join('');
        }
    }

    // News related utility methods
    getTimeAgo(timestamp) {
        const now = new Date();
        const publishedTime = new Date(timestamp);
        const diffMs = now - publishedTime;
        
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return publishedTime.toLocaleDateString('en-US');
    }

    getSentimentText(sentiment) {
        const sentimentMap = {
            'positive': 'Positive',
            'negative': 'Negative',
            'neutral': 'Neutral'
        };
        return sentimentMap[sentiment] || 'Neutral';
    }

    getImportanceIndicator(importance) {
        if (importance > 0.8) {
            return '<span class="importance-badge high">⚡ Important</span>';
        } else if (importance > 0.6) {
            return '<span class="importance-badge medium">📌 Noteworthy</span>';
        }
        return '';
    }

    getMarketImpactText(marketImpact) {
        const impactMap = {
            'positive': 'A high proportion of positive news is expected to have a positive impact on the market.',
            'negative': 'A high proportion of negative news may have a negative impact on the market.',
            'neutral': 'Mixed positive and negative news indicates a neutral market sentiment.'
        };
        return impactMap[marketImpact] || impactMap['neutral'];
    }

    getSentimentSummary(sentimentBreakdown) {
        if (!sentimentBreakdown) return 'No sentiment analysis data.';
        
        const total = (sentimentBreakdown.positive || 0) + (sentimentBreakdown.negative || 0) + (sentimentBreakdown.neutral || 0);
        if (total === 0) return 'No news to analyze.';
        
        const posPerc = Math.round((sentimentBreakdown.positive || 0) / total * 100);
        const negPerc = Math.round((sentimentBreakdown.negative || 0) / total * 100);
        const neutPerc = Math.round((sentimentBreakdown.neutral || 0) / total * 100);
        
        return `Showing a distribution of ${posPerc}% positive, ${negPerc}% negative, and ${neutPerc}% neutral.`;
    }

    setupNewsFiltering() {
        // 카테고리 필터
        const categoryFilter = document.getElementById('news-category');
        const sentimentFilter = document.getElementById('sentiment-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterNews('category', e.target.value);
            });
        }
        
        if (sentimentFilter) {
            sentimentFilter.addEventListener('change', (e) => {
                this.filterNews('sentiment', e.target.value);
            });
        }
    }

    filterNews(filterType, filterValue) {
        const newsItems = document.querySelectorAll('.news-item');
        
        newsItems.forEach(item => {
            let shouldShow = true;
            
            if (filterType === 'category' && filterValue !== 'all') {
                const category = item.dataset.category;
                shouldShow = category === filterValue;
            } else if (filterType === 'sentiment' && filterValue !== 'all') {
                const sentimentBadge = item.querySelector('.sentiment-badge');
                if (sentimentBadge) {
                    const sentiment = sentimentBadge.classList.contains('sentiment-positive') ? 'positive' :
                                    sentimentBadge.classList.contains('sentiment-negative') ? 'negative' : 'neutral';
                    shouldShow = sentiment === filterValue;
                }
            }
            
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    initializeDataPage() {
        console.log('initializeDataPage called');
        // Initialize data table
        this.loadDataTable('stock_data');
        
        // Update data statistics
        this.updateDataStats();
        
        // Initialize data visualization chart
        this.initializeDataVisualization();
    }

    loadDataTable(datasetType) {
        const table = document.getElementById('data-table');
        if (table) {
            // Generate mock data
            const mockData = this.generateMockData(datasetType);
            
            table.innerHTML = `
                <thead>
                    <tr>${Object.keys(mockData[0] || {}).map(key => `<th>${key}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${mockData.map(row => `
                        <tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            `;
        }
    }

    generateMockData(type) {
        const data = [];
        const count = 20;
        
        for (let i = 0; i < count; i++) {
            switch(type) {
                case 'stock_data':
                    data.push({
                        'Symbol': ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'][i % 5],
                        'Price': (Math.random() * 200 + 100).toFixed(2),
                        'Volume': Math.floor(Math.random() * 1000000),
                        'Change': ((Math.random() - 0.5) * 10).toFixed(2) + '%'
                    });
                    break;
                case 'news_data':
                    data.push({
                        'Title': `News Title ${i + 1}`,
                        'Sentiment': ['Positive', 'Negative', 'Neutral'][Math.floor(Math.random() * 3)],
                        'Score': (Math.random()).toFixed(3),
                        'Date': new Date(Date.now() - i * 3600000).toLocaleDateString()
                    });
                    break;
                default:
                    data.push({
                        'ID': i + 1,
                        'Value': Math.random().toFixed(4),
                        'Status': ['Active', 'Inactive'][Math.floor(Math.random() * 2)]
                    });
            }
        }
        
        return data;
    }

    updateDataStats() {
        const container = document.getElementById('data-stats');
        if (container) {
            container.innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">Total Data Count</div>
                    <div class="stat-value">12,450</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Last Updated</div>
                    <div class="stat-value">${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Data Quality</div>
                    <div class="stat-value">98.7%</div>
                </div>
            `;
        }
    }

    initializeDataVisualization() {
        const ctx = document.getElementById('data-visualization');
        if (ctx && ctx.getContext) {
            const chart = new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Data Collection Volume',
                        data: [1200, 1900, 3000, 2500, 2000],
                        backgroundColor: 'rgba(102, 126, 234, 0.6)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    initializeCodePage() {
        console.log('initializeCodePage called');
        // Set up file selection event
        const fileSelector = document.getElementById('file-selector');
        if (fileSelector) {
            fileSelector.addEventListener('change', (e) => {
                this.loadSourceFile(e.target.value);
            });
        }
    }

    async loadSourceFile(filePath) {
        if (!filePath) return;
        
        const codeDisplay = document.getElementById('code-display');
        const filePathElement = document.getElementById('file-path');
        
        if (filePathElement) {
            filePathElement.textContent = filePath;
        }
        
        if (codeDisplay) {
            try {
                // Attempt to load actual file
                const response = await fetch(`../${filePath}`);
                let code;
                
                if (response.ok) {
                    code = await response.text();
                } else {
                    // Display mock code if file not found
                    code = this.getMockCode(filePath);
                }
                
                // Detect language
                const language = this.detectLanguage(filePath);
                codeDisplay.className = `language-${language}`;
                codeDisplay.textContent = code;
                
                // Apply syntax highlighting with Prism.js
                if (window.Prism) {
                    Prism.highlightElement(codeDisplay);
                }
                
            } catch (error) {
                console.error('File load failed:', error);
                codeDisplay.textContent = '// Could not load file.';
            }
        }
    }

    detectLanguage(filePath) {
        const extension = filePath.split('.').pop().toLowerCase();
        const languageMap = {
            'py': 'python',
            'js': 'javascript',
            'html': 'html',
            'css': 'css',
            'json': 'json'
        };
        return languageMap[extension] || 'text';
    }

    getMockCode(filePath) {
        const mockCodes = {
            'dashboard/dashboard.js': `// Main Dashboard JavaScript file
class DashboardManager {
    constructor() {
        this.charts = {};
        this.updateInterval = 5000;
        this.init();
    }
    
    async init() {
        this.setupCharts();
        this.startRealTimeUpdates();
        this.loadInitialData();
    }
    
    // Chart setup
    setupCharts() {
        // performance chart is now handled by dashboard-tab.js
        this.setupVolumeChart();
    }
}`,
            'src/models/model_training.py': `# Model Training Script
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

class ModelTrainer:
    def __init__(self):
        self.models = {}
        
    def train_random_forest(self, X, y):
        """Train Random Forest model"""
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            random_state=42
        )
        
        model.fit(X_train, y_train)
        return model`
        };
        
        return mockCodes[filePath] || '// Could not load code.';
    }

    initializeLogsPage() {
        console.log('initializeLogsPage called');
        this.loadSystemLogs();
        this.initializeLogStatsChart();
    }

    loadSystemLogs() {
        const logViewer = document.getElementById('log-viewer');
        if (logViewer) {
            const mockLogs = [
                { time: '14:23:15', level: 'info', message: 'Model training started' },
                { time: '14:23:45', level: 'info', message: 'Data preprocessing completed' },
                { time: '14:24:12', level: 'warning', message: 'High memory usage detected: 85%' },
                { time: '14:24:33', level: 'info', message: 'Random Forest model training completed' },
                { time: '14:24:55', level: 'error', message: 'LSTM model training failed: CUDA out of memory' },
                { time: '14:25:20', level: 'info', message: 'Gradient Boosting model training started' }
            ];
            
            logViewer.innerHTML = mockLogs.map(log => `
                <div class="log-entry">
                    <span class="timestamp">${log.time}</span>
                    <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('');
        }
    }

    initializeLogStatsChart() {
        const ctx = document.getElementById('log-stats-chart');
        if (ctx && ctx.getContext) {
            const chart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: this.generateTimeLabels(12),
                    datasets: [{
                        label: 'ERROR',
                        data: Array.from({length: 12}, () => Math.floor(Math.random() * 5)),
                        borderColor: '#e74c3c',
                        fill: false
                    }, {
                        label: 'WARNING',
                        data: Array.from({length: 12}, () => Math.floor(Math.random() * 15)),
                        borderColor: '#f39c12',
                        fill: false
                    }, {
                        label: 'INFO',
                        data: Array.from({length: 12}, () => Math.floor(Math.random() * 50) + 20),
                        borderColor: '#3498db',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    initializeSettingsPage() {
        console.log('initializeSettingsPage called');
        this.loadCurrentSettings();
        this.setupSettingsEvents();
    }

    loadCurrentSettings() {
        // Settings load logic
        const updateInterval = localStorage.getItem('updateInterval') || '5';
        const theme = localStorage.getItem('theme') || 'light';
        const autoRefresh = localStorage.getItem('autoRefresh') !== 'false';
        
        document.getElementById('update-interval').value = updateInterval;
        document.getElementById('theme-selector').value = theme;
        document.getElementById('auto-refresh').checked = autoRefresh;
    }

    setupSettingsEvents() {
        // Set up settings event listeners
        const saveBtn = document.querySelector('.btn-primary');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }
    }

    saveSettings() {
        const updateInterval = document.getElementById('update-interval').value;
        const theme = document.getElementById('theme-selector').value;
        const autoRefresh = document.getElementById('auto-refresh').checked;
        
        localStorage.setItem('updateInterval', updateInterval);
        localStorage.setItem('theme', theme);
        localStorage.setItem('autoRefresh', autoRefresh);
        
        // Apply settings
        if (window.dashboard) {
            window.dashboard.updateInterval = parseInt(updateInterval) * 1000;
        }
        
        // Display success message
        this.showAlert('Settings saved.', 'success');
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.page.active');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }
    }

    // Utility methods
    generateTimeLabels(count) {
        const labels = [];
        const now = new Date();
        for (let i = count - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
        }
        return labels;
    }

    generateMockPriceData(count, stockSymbol = 'AAPL', offset = 0) {
        const data = [];
        // Different base prices for different stocks
        const stockBasePrices = {
            'AAPL': 180,
            'MSFT': 380,
            'GOOGL': 140,
            'AMZN': 150,
            'TSLA': 250,
            'NVDA': 450,
            'META': 320,
            'NFLX': 420,
            'JPM': 145,
            'UNH': 520
        };
        
        let basePrice = (stockBasePrices[stockSymbol] || 150) + offset;
        for (let i = 0; i < count; i++) {
            basePrice += (Math.random() - 0.5) * (basePrice * 0.03); // 3% volatility
            data.push(Math.max(50, basePrice));
        }
        return data;
    }
    
    setupPredictionStockSelector() {
        const selector = document.getElementById('prediction-stock-selector');
        if (selector) {
            selector.addEventListener('change', (event) => {
                const selectedStock = event.target.value;
                const selectedText = event.target.options[event.target.selectedIndex].text;
                console.log(`Prediction chart stock changed to: ${selectedStock}`);
                
                // Update chart
                this.initializePredictionChart(selectedStock);
                
                // Update description
                const description = document.getElementById('prediction-chart-description');
                if (description) {
                    description.textContent = `Currently displaying real-time price prediction chart for ${selectedText}. The blue solid line represents the actual price, and the red dashed line represents the AI model's predicted price.`;
                }
            });
        }
    }

    async initializeXAIPage() {
        console.log('[ROUTER] Initializing XAI page with modular approach');
        if (!this.tabInstances.xai) {
            if (window.XAITab) {
                this.tabInstances.xai = new window.XAITab();
            } else {
                console.warn('[ROUTER] XAITab class not available, falling back to legacy');
                this.initializeXAIPageLegacy();
                return;
            }
        }
        await this.tabInstances.xai.init();
    }

    initializeXAIPageLegacy() {
        console.log('[XAI DEBUG] initializeXAIPage called (legacy)');
        console.log('[XAI DEBUG] window.dashboard:', window.dashboard);
        console.log('[XAI DEBUG] window.dashboard.extensions:', window.dashboard ? window.dashboard.extensions : 'dashboard not available');
        
        // Wait for dashboard to be fully initialized
        this.waitForDashboard().then(() => {
            if (window.dashboard && window.dashboard.extensions) {
                console.log('[XAI DEBUG] Dashboard and extensions available, calling loadXAIData');
                // Ensure XAI data is loaded and charts are rendered
                try {
                    window.dashboard.extensions.loadXAIData();
                    console.log('[XAI DEBUG] XAI data loading completed');
                    
                    // Setup refresh button event listener
                    this.setupXAIRefreshButton();
                    
                    // Trigger initial XAI stock analysis
                    if (window.dashboard.handleXaiStockChange) {
                        console.log('[XAI DEBUG] Triggering initial XAI stock analysis for NVDA');
                        window.dashboard.handleXaiStockChange('NVDA');
                    }
                } catch (error) {
                    console.error('[XAI DEBUG] Error loading XAI data:', error);
                    // Show mock data instead
                    this.showXAIFallback();
                }
            } else {
                console.error('[XAI DEBUG] Dashboard or extensions not available after waiting');
                this.showXAIFallback();
            }
        });
    }

    // Wait for dashboard initialization with timeout
    waitForDashboard(maxAttempts = 50, intervalMs = 100) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            
            const checkDashboard = () => {
                attempts++;
                console.log(`[XAI DEBUG] Checking dashboard availability (attempt ${attempts}/${maxAttempts})`);
                
                if (window.dashboard) {
                    console.log('[XAI DEBUG] Dashboard found and ready (extensions may be null)');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.error('[XAI DEBUG] Dashboard not available after maximum attempts');
                    reject(new Error('Dashboard not available'));
                } else {
                    setTimeout(checkDashboard, intervalMs);
                }
            };
            
            checkDashboard();
        });
    }

    // Fallback for when dashboard is not available
    showXAIFallback() {
        console.log('[XAI DEBUG] Showing XAI fallback with static content');
        this.showXAIErrorMessage();
        
        // Try to show some static content
        const containers = [
            'feature-importance-chart',
            'shap-summary-plot', 
            'shap-force-plot',
            'lime-explanation'
        ];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="xai-loading">
                        <h4>${containerId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <p>Dashboard system is still initializing. Please wait or refresh the page.</p>
                    </div>
                `;
            }
        });
    }

    // Setup XAI refresh button event listener
    setupXAIRefreshButton() {
        console.log('[XAI DEBUG] Setting up refresh button event listener');
        const refreshBtn = document.getElementById('refresh-xai-btn');
        
        if (refreshBtn) {
            // Remove any existing listeners
            refreshBtn.removeEventListener('click', this.handleXAIRefresh);
            
            // Add new listener
            this.handleXAIRefresh = () => {
                console.log('[XAI DEBUG] Refresh button clicked');
                
                if (window.dashboard && typeof window.dashboard.refreshXAIData === 'function') {
                    console.log('[XAI DEBUG] Calling dashboard.refreshXAIData');
                    window.dashboard.refreshXAIData();
                } else {
                    console.error('[XAI DEBUG] dashboard.refreshXAIData not available');
                    console.log('[XAI DEBUG] window.dashboard:', window.dashboard);
                    console.log('[XAI DEBUG] Available methods:', window.dashboard ? Object.getOwnPropertyNames(window.dashboard) : 'No dashboard');
                }
            };
            
            refreshBtn.addEventListener('click', this.handleXAIRefresh);
            console.log('[XAI DEBUG] Refresh button event listener added successfully');
        } else {
            console.error('[XAI DEBUG] Refresh button not found');
        }
    }

    showXAIErrorMessage() {
        const containers = [
            'feature-importance-chart',
            'shap-summary-plot', 
            'shap-force-plot',
            'lime-explanation'
        ];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<div class="xai-error"><p>XAI system not initialized. Check console for details.</p></div>';
            }
        });
    }

    // Initialize Progress page
    async initializeProgressPage() {
        console.log('[ROUTER] Initializing progress page with modular approach');
        console.log('[ROUTER] window.ProgressTab available:', !!window.ProgressTab);
        console.log('[ROUTER] this.tabInstances.progress exists:', !!this.tabInstances.progress);
        
        if (!this.tabInstances.progress) {
            if (window.ProgressTab) {
                console.log('[ROUTER] Creating new ProgressTab instance');
                this.tabInstances.progress = new window.ProgressTab();
                window.progressTab = this.tabInstances.progress; // Global reference for tab switching
                console.log('[ROUTER] ProgressTab instance created successfully');
            } else {
                console.error('[ROUTER] ProgressTab class not available, falling back to legacy');
                console.error('[ROUTER] Available window properties:', Object.keys(window).filter(key => key.includes('Tab')));
                this.initializeProgressPageLegacy();
                return;
            }
        }
        
        try {
            console.log('[ROUTER] Calling progress init()');
            await this.tabInstances.progress.init();
            console.log('[ROUTER] Progress page initialized successfully');
        } catch (error) {
            console.error('[ROUTER] Error initializing progress page:', error);
            this.initializeProgressPageLegacy();
        }
    }

    initializeProgressPageLegacy() {
        console.log('initializeProgressPage called (legacy)');
        const container = document.getElementById('page-progress');
        if (container) {
            const legacyWidget = document.createElement('div');
            legacyWidget.className = 'widget large-widget';
            legacyWidget.style.background = '#f44336';
            legacyWidget.style.color = 'white';
            legacyWidget.innerHTML = `
                <h2>⚠️ LEGACY MODE ⚠️</h2>
                <div class="progress-placeholder">
                    <p>ProgressTab class not loaded. Using legacy mode.</p>
                    <p>Time: ${new Date().toLocaleTimeString()}</p>
                </div>
            `;
            // Find progress-grid or append to container directly
            const progressGrid = container.querySelector('.progress-grid');
            if (progressGrid) {
                progressGrid.appendChild(legacyWidget);
            } else {
                container.appendChild(legacyWidget);
            }
            console.log('[ROUTER] Added legacy mode widget');
        }
    }

    // Initialize Datasets page
    async initializeDatasetsPage() {
        console.log('[ROUTER] Initializing datasets page with modular approach');
        console.log('[ROUTER] window.DatasetsTab available:', !!window.DatasetsTab);
        console.log('[ROUTER] this.tabInstances.datasets exists:', !!this.tabInstances.datasets);
        
        if (!this.tabInstances.datasets) {
            if (window.DatasetsTab) {
                console.log('[ROUTER] Creating new DatasetsTab instance');
                this.tabInstances.datasets = new window.DatasetsTab();
                window.datasetsTab = this.tabInstances.datasets; // Global reference for button actions
                console.log('[ROUTER] DatasetsTab instance created successfully');
            } else {
                console.error('[ROUTER] DatasetsTab class not available, falling back to legacy');
                console.error('[ROUTER] Available window properties:', Object.keys(window).filter(key => key.includes('Tab')));
                this.initializeDatasetsPageLegacy();
                return;
            }
        }
        
        try {
            console.log('[ROUTER] Calling datasets init()');
            await this.tabInstances.datasets.init();
            console.log('[ROUTER] Datasets page initialized successfully');
        } catch (error) {
            console.error('[ROUTER] Error initializing datasets page:', error);
            this.initializeDatasetsPageLegacy();
        }
    }

    initializeDatasetsPageLegacy() {
        console.log('initializeDatasetsPage called (legacy)');
        const container = document.getElementById('page-datasets');
        if (container) {
            container.innerHTML = `
                <div class="datasets-content">
                    <h2>Dataset Management</h2>
                    <div class="datasets-placeholder">
                        <p>DatasetsTab class not loaded. Please check the script inclusion.</p>
                    </div>
                </div>
            `;
        }
    }
}

// Create global router instance
window.router = new Router();