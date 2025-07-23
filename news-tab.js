/**
 * News Tab Manager
 * Handles news analysis functionality independently
 */
class NewsTab {
    constructor() {
        this.charts = {};
        this.isInitialized = false;
        this.newsData = [];
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('[NEWS TAB] Initializing news tab...');
        this.setupSentimentChart();
        this.loadNewsData();
        this.updateLLMAnalysisSummary();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupSentimentChart() {
        const ctx = document.getElementById('sentiment-chart');
        if (!ctx) return;

        const sentimentData = {
            positive: 45,
            negative: 25,
            neutral: 30
        };

        this.charts.sentiment = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [sentimentData.positive, sentimentData.negative, sentimentData.neutral],
                    backgroundColor: [
                        '#28a745', // Green for positive
                        '#dc3545', // Red for negative
                        '#6c757d'  // Gray for neutral
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                },
                // Add center text plugin
                elements: {
                    center: {
                        text: this.getSentimentLabel(sentimentData),
                        color: this.getSentimentColor(sentimentData),
                        fontStyle: 'Arial',
                        sidePadding: 20,
                        minFontSize: 16,
                        lineHeight: 25
                    }
                }
            },
            plugins: [{
                // Custom plugin to draw center text
                id: 'centerText',
                beforeDraw: function(chart) {
                    if (chart.config.options.elements && chart.config.options.elements.center) {
                        const ctx = chart.ctx;
                        const centerConfig = chart.config.options.elements.center;
                        const fontStyle = centerConfig.fontStyle || 'Arial';
                        const txt = centerConfig.text;
                        const color = centerConfig.color || '#000';
                        const minFontSize = centerConfig.minFontSize || 16;
                        const sidePadding = centerConfig.sidePadding || 20;
                        const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);

                        // Start with a base font of 30px
                        ctx.font = "30px " + fontStyle;

                        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                        const stringWidth = ctx.measureText(txt).width;
                        const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                        // Find out how much the font can grow in width.
                        const widthRatio = elementWidth / stringWidth;
                        const newFontSize = Math.floor(30 * widthRatio);
                        const elementHeight = (chart.innerRadius * 2);

                        // Pick a new font size so it will not be larger than the height of label.
                        const fontSizeToUse = Math.min(newFontSize, elementHeight, minFontSize);
                        const lineHeight = centerConfig.lineHeight || 25;

                        // Set font settings to draw it correctly.
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                        const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                        ctx.font = fontSizeToUse + "px " + fontStyle;
                        ctx.fillStyle = color;

                        // Draw text in center
                        ctx.fillText(txt, centerX, centerY);
                    }
                }
            }]
        });
    }

    getSentimentLabel(data) {
        if (data.positive > data.negative && data.positive > data.neutral) {
            return 'POSITIVE\\nMarket';
        } else if (data.negative > data.positive && data.negative > data.neutral) {
            return 'NEGATIVE\\nMarket';
        } else {
            return 'NEUTRAL\\nMarket';
        }
    }

    getSentimentColor(data) {
        if (data.positive > data.negative && data.positive > data.neutral) {
            return '#28a745'; // Green
        } else if (data.negative > data.positive && data.negative > data.neutral) {
            return '#dc3545'; // Red
        } else {
            return '#6c757d'; // Gray
        }
    }

    loadNewsData() {
        // Generate mock news data
        this.newsData = [
            {
                title: "Federal Reserve Maintains Interest Rates",
                summary: "The Fed keeps rates steady amid economic uncertainty",
                sentiment: "neutral",
                impact: "high",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                source: "Reuters"
            },
            {
                title: "Tech Stocks Rally on AI Optimism",
                summary: "Major technology companies see gains on artificial intelligence developments",
                sentiment: "positive",
                impact: "medium",
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                source: "Bloomberg"
            },
            {
                title: "Energy Sector Faces Headwinds",
                summary: "Oil prices decline amid supply concerns",
                sentiment: "negative",
                impact: "medium",
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                source: "CNBC"
            },
            {
                title: "Consumer Spending Shows Resilience",
                summary: "Retail sales data exceeds expectations",
                sentiment: "positive",
                impact: "high",
                timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
                source: "Wall Street Journal"
            },
            {
                title: "Inflation Data Meets Forecasts",
                summary: "CPI remains within expected range",
                sentiment: "neutral",
                impact: "high",
                timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
                source: "Financial Times"
            }
        ];

        this.updateNewsFeed();
    }

    updateNewsFeed() {
        const newsFeed = document.getElementById('news-feed');
        if (!newsFeed) return;

        let html = '';
        this.newsData.forEach(news => {
            const sentimentClass = `sentiment-${news.sentiment}`;
            const impactClass = `impact-${news.impact}`;
            const timeAgo = this.getTimeAgo(news.timestamp);

            html += `
                <div class="news-item ${sentimentClass}">
                    <div class="news-header">
                        <h4 class="news-title">${news.title}</h4>
                        <div class="news-meta">
                            <span class="news-source">${news.source}</span>
                            <span class="news-time">${timeAgo}</span>
                        </div>
                    </div>
                    <p class="news-summary">${news.summary}</p>
                    <div class="news-footer">
                        <span class="sentiment-badge ${sentimentClass}">
                            ${news.sentiment.toUpperCase()}
                        </span>
                        <span class="impact-badge ${impactClass}">
                            ${news.impact.toUpperCase()} IMPACT
                        </span>
                    </div>
                </div>
            `;
        });

        newsFeed.innerHTML = html;
    }

    updateLLMAnalysisSummary() {
        // Update LLM Analysis Summary instead of showing "Loading..."
        const llmMarketSentiment = document.getElementById('llm-market-sentiment');
        const llmEventCategory = document.getElementById('llm-event-category');

        if (llmMarketSentiment) {
            llmMarketSentiment.innerHTML = `
                <div class="llm-analysis-content">
                    <span class="sentiment-positive">Cautiously Optimistic</span>
                    <p>Current market sentiment shows mixed signals with technology sector leading gains while energy faces challenges. Federal Reserve policy remains supportive.</p>
                </div>
            `;
        }

        if (llmEventCategory) {
            llmEventCategory.innerHTML = `
                <div class="llm-analysis-content">
                    <span class="category-monetary">Monetary Policy Focus</span>
                    <p>Key events center around Federal Reserve decisions and inflation data, with secondary focus on sector-specific developments in technology and energy.</p>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Category filter
        const categoryFilter = document.getElementById('news-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterNews('category', e.target.value);
            });
        }

        // Sentiment filter
        const sentimentFilter = document.getElementById('sentiment-filter');
        if (sentimentFilter) {
            sentimentFilter.addEventListener('change', (e) => {
                this.filterNews('sentiment', e.target.value);
            });
        }

        // Load more news button
        const loadMoreBtn = document.getElementById('load-more-news');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreNews();
            });
        }
    }

    filterNews(filterType, filterValue) {
        let filteredData = [...this.newsData];

        if (filterValue !== 'all') {
            if (filterType === 'sentiment') {
                filteredData = filteredData.filter(news => news.sentiment === filterValue);
            }
            // Add more filter types as needed
        }

        // Update display with filtered data
        this.displayFilteredNews(filteredData);
    }

    displayFilteredNews(filteredData) {
        const newsFeed = document.getElementById('news-feed');
        if (!newsFeed) return;

        let html = '';
        filteredData.forEach(news => {
            const sentimentClass = `sentiment-${news.sentiment}`;
            const impactClass = `impact-${news.impact}`;
            const timeAgo = this.getTimeAgo(news.timestamp);

            html += `
                <div class="news-item ${sentimentClass}">
                    <div class="news-header">
                        <h4 class="news-title">${news.title}</h4>
                        <div class="news-meta">
                            <span class="news-source">${news.source}</span>
                            <span class="news-time">${timeAgo}</span>
                        </div>
                    </div>
                    <p class="news-summary">${news.summary}</p>
                    <div class="news-footer">
                        <span class="sentiment-badge ${sentimentClass}">
                            ${news.sentiment.toUpperCase()}
                        </span>
                        <span class="impact-badge ${impactClass}">
                            ${news.impact.toUpperCase()} IMPACT
                        </span>
                    </div>
                </div>
            `;
        });

        newsFeed.innerHTML = html || '<p class="no-news">No news matches the selected filters.</p>';
    }

    loadMoreNews() {
        const loadingIndicator = document.getElementById('news-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'inline-block';
        }

        // Simulate loading delay
        setTimeout(() => {
            // Add more mock news data
            const additionalNews = [
                {
                    title: "Banking Sector Shows Stability",
                    summary: "Major banks report steady quarterly results",
                    sentiment: "positive",
                    impact: "medium",
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
                    source: "Reuters"
                },
                {
                    title: "Supply Chain Disruptions Continue",
                    summary: "Global logistics face ongoing challenges",
                    sentiment: "negative",
                    impact: "high",
                    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
                    source: "Bloomberg"
                }
            ];

            this.newsData = [...this.newsData, ...additionalNews];
            this.updateNewsFeed();

            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }, 1500);
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diffMs = now - timestamp;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffHours > 0) {
            return `${diffHours}h ago`;
        } else if (diffMins > 0) {
            return `${diffMins}m ago`;
        } else {
            return 'Just now';
        }
    }

    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) chart.destroy();
        });
        this.charts = {};
        this.isInitialized = false;
    }
}

// Export for global access
window.NewsTab = NewsTab;