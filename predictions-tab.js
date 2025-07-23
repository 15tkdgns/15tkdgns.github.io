/**
 * Predictions Tab Manager
 * Handles real-time predictions functionality independently
 */
class PredictionsTab {
    constructor() {
        this.charts = {};
        this.isInitialized = false;
        this.predictionData = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('[PREDICTIONS TAB] Initializing predictions tab...');
        this.setupPredictionChart();
        this.createConfidenceMeters();
        this.updatePredictionsTable();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupPredictionChart() {
        const ctx = document.getElementById('prediction-chart');
        if (!ctx) return;

        this.charts.prediction = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(20),
                datasets: [{
                    label: 'Actual Price',
                    data: this.generateMockPriceData(20, 'AAPL'),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true
                }, {
                    label: 'Predicted Price',
                    data: this.generateMockPriceData(20, 'AAPL', 5),
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: false,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Price Prediction vs Actual'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        });
    }

    createConfidenceMeters() {
        const container = document.getElementById('confidence-meters');
        if (!container) return;

        // Extended stock list with more companies
        const stocks = [
            { symbol: 'AAPL', confidence: 85, name: 'Apple Inc.' },
            { symbol: 'GOOGL', confidence: 91, name: 'Alphabet Inc.' },
            { symbol: 'MSFT', confidence: 86, name: 'Microsoft Corp.' },
            { symbol: 'AMZN', confidence: 89, name: 'Amazon.com Inc.' },
            { symbol: 'TSLA', confidence: 78, name: 'Tesla Inc.' },
            { symbol: 'META', confidence: 83, name: 'Meta Platforms Inc.' },
            { symbol: 'NVDA', confidence: 94, name: 'NVIDIA Corp.' },
            { symbol: 'NFLX', confidence: 77, name: 'Netflix Inc.' },
            { symbol: 'JPM', confidence: 88, name: 'JPMorgan Chase & Co.' },
            { symbol: 'V', confidence: 92, name: 'Visa Inc.' }
        ];

        let html = '';
        stocks.forEach(stock => {
            html += `
                <div class="confidence-meter">
                    <div class="meter-header">
                        <span class="stock-symbol">${stock.symbol}</span>
                        <span class="stock-name">${stock.name}</span>
                        <span class="confidence-value">${stock.confidence}%</span>
                    </div>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${stock.confidence}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    updatePredictionsTable() {
        this.generatePredictionData();
        this.renderTable();
        this.updatePagination();
    }

    generatePredictionData() {
        const companies = [
            { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
            { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
            { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
            { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
            { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
            { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment' },
            { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
            { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services' },
            { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
            { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples' },
            { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
            { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
            { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary' }
        ];

        this.predictionData = companies.map(company => {
            const currentPrice = Math.random() * 500 + 50;
            const predictedPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.1);
            const change = ((predictedPrice - currentPrice) / currentPrice * 100);
            const confidence = Math.random() * 30 + 70;
            
            // Use 24-hour format for prediction time
            const now = new Date();
            const predictionTime = new Date(now.getTime() + Math.random() * 24 * 60 * 60 * 1000);
            
            return {
                symbol: company.symbol,
                name: company.name,
                sector: company.sector,
                currentPrice: currentPrice.toFixed(2),
                predictedPrice: predictedPrice.toFixed(2),
                change: change.toFixed(2),
                confidence: confidence.toFixed(1),
                predictionTime: predictionTime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // 24-hour format
                })
            };
        });
    }

    renderTable() {
        const tbody = document.getElementById('predictions-table-body');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.predictionData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(prediction => {
            const changeClass = parseFloat(prediction.change) >= 0 ? 'positive' : 'negative';
            const changeIcon = parseFloat(prediction.change) >= 0 ? '↗' : '↘';
            
            html += `
                <tr>
                    <td>${prediction.symbol}</td>
                    <td>${prediction.name}</td>
                    <td>${prediction.sector}</td>
                    <td>$${prediction.currentPrice}</td>
                    <td>$${prediction.predictedPrice}</td>
                    <td class="${changeClass}">${changeIcon} ${Math.abs(prediction.change)}%</td>
                    <td>
                        <div class="confidence-indicator" style="width: ${prediction.confidence}%">
                            ${prediction.confidence}%
                        </div>
                    </td>
                    <td>${prediction.predictionTime}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.predictionData.length / this.itemsPerPage);
        const pageNumbers = document.getElementById('page-numbers');
        
        if (!pageNumbers) return;

        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="window.predictionsTab.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        pageNumbers.innerHTML = html;
        
        // Update prev/next buttons
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderTable();
        this.updatePagination();
    }

    setupEventListeners() {
        // Previous page button
        const prevBtn = document.getElementById('prev-page');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.goToPage(this.currentPage - 1);
                }
            });
        }

        // Next page button
        const nextBtn = document.getElementById('next-page');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.predictionData.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.goToPage(this.currentPage + 1);
                }
            });
        }

        // Items per page selector
        const itemsPerPageSelect = document.getElementById('items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderTable();
                this.updatePagination();
            });
        }
    }

    generateTimeLabels(count) {
        const labels = [];
        const now = new Date();
        for (let i = count - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false // 24-hour format
            }));
        }
        return labels;
    }

    generateMockPriceData(points, symbol, offset = 0) {
        const data = [];
        let basePrice = 150;
        
        // Different base prices for different stocks
        switch(symbol) {
            case 'AAPL': basePrice = 180; break;
            case 'MSFT': basePrice = 350; break;
            case 'GOOGL': basePrice = 140; break;
            case 'AMZN': basePrice = 160; break;
            default: basePrice = 150;
        }
        
        for (let i = 0; i < points; i++) {
            basePrice += (Math.random() - 0.5) * 10 + offset;
            data.push(parseFloat(basePrice.toFixed(2)));
        }
        return data;
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
window.PredictionsTab = PredictionsTab;