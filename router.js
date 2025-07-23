// SPA 라우터 클래스
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        // 페이지 타이틀 매핑
        this.pageTitles = {
            'dashboard': '대시보드',
            'models': '모델 성능',
            'predictions': '실시간 예측',
            'news': '뉴스 분석',
            'data': '데이터 탐색기',
            'code': '소스 코드',
            'logs': '시스템 로그',
            'settings': '설정',
            'xai': 'XAI 분석'
        };

        // 네비게이션 클릭 이벤트 설정
        this.setupNavigation();
        
        // 브라우저 뒤로가기/앞으로가기 처리
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });

        // 초기 페이지 로드
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
        // 현재 활성 페이지 숨기기
        const currentPageElement = document.querySelector('.page.active');
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }

        // 새 페이지 표시
        const newPageElement = document.getElementById(`page-${page}`);
        if (newPageElement) {
            newPageElement.classList.add('active');
        }

        // 네비게이션 활성 상태 업데이트
        this.updateActiveNavigation(page);

        // 페이지 타이틀 업데이트
        this.updatePageTitle(page);

        // URL 업데이트
        if (updateHistory) {
            window.history.pushState({ page }, '', `#${page}`);
        }

        // 페이지별 초기화 실행
        this.initializePage(page);

        this.currentPage = page;
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
        const title = this.pageTitles[page] || '대시보드';
        document.getElementById('page-title').textContent = title;
        document.title = `AI 주식 예측 시스템 - ${title}`;
    }

    getPageFromHash() {
        const hash = window.location.hash.substring(1);
        return hash || null;
    }

    initializePage(page) {
        switch(page) {
            case 'dashboard':
                if (window.dashboard) {
                    window.dashboard.refreshDashboard();
                }
                break;
            case 'models':
                this.initializeModelsPage();
                break;
            case 'predictions':
                this.initializePredictionsPage();
                break;
            case 'news':
                this.initializeNewsPage();
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
                this.initializeXAIPage();
                break;
        }
    }

    initializeModelsPage() {
        // 모델 성능 테이블 생성
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
                    status: '활성'
                },
                {
                    name: 'Gradient Boosting',
                    accuracy: 0.912,
                    precision: 0.895,
                    recall: 0.928,
                    f1Score: 0.911,
                    processingTime: 0.234,
                    status: '활성'
                },
                {
                    name: 'LSTM',
                    accuracy: 0.887,
                    precision: 0.872,
                    recall: 0.903,
                    f1Score: 0.887,
                    processingTime: 1.456,
                    status: '대기'
                }
            ];

            tableBody.innerHTML = models.map(model => `
                <tr>
                    <td><strong>${model.name}</strong></td>
                    <td>${(model.accuracy * 100).toFixed(1)}%</td>
                    <td>${(model.precision * 100).toFixed(1)}%</td>
                    <td>${(model.recall * 100).toFixed(1)}%</td>
                    <td>${(model.f1Score * 100).toFixed(1)}%</td>
                    <td>${model.processingTime}초</td>
                    <td><span class="status-badge ${model.status === '활성' ? 'active' : 'inactive'}">${model.status}</span></td>
                </tr>
            `).join('');
        }

        // 모델 아키텍처 표시
        this.displayModelArchitecture();
        
        // 하이퍼파라미터 표시
        this.displayHyperparameters();
    }

    displayModelArchitecture() {
        const container = document.getElementById('model-architecture');
        if (container) {
            container.innerHTML = `
                <div class="architecture-item">
                    <h4>Random Forest</h4>
                    <ul>
                        <li>트리 개수: 100</li>
                        <li>최대 깊이: 15</li>
                        <li>특성 선택: sqrt</li>
                    </ul>
                </div>
                <div class="architecture-item">
                    <h4>Gradient Boosting</h4>
                    <ul>
                        <li>학습률: 0.1</li>
                        <li>트리 개수: 200</li>
                        <li>최대 깊이: 8</li>
                    </ul>
                </div>
                <div class="architecture-item">
                    <h4>LSTM</h4>
                    <ul>
                        <li>은닉층: 128</li>
                        <li>시퀀스 길이: 30</li>
                        <li>드롭아웃: 0.2</li>
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
                    <h4>공통 설정</h4>
                    <div class="param-item">
                        <span>검증 분할:</span>
                        <span>0.2</span>
                    </div>
                    <div class="param-item">
                        <span>랜덤 시드:</span>
                        <span>42</span>
                    </div>
                    <div class="param-item">
                        <span>교차 검증:</span>
                        <span>5-Fold</span>
                    </div>
                </div>
            `;
        }
    }

    initializePredictionsPage() {
        // 예측 차트 초기화
        this.initializePredictionChart();
        
        // 신뢰도 미터 생성
        this.createConfidenceMeters();
        
        // 예측 결과 테이블 업데이트
        this.updatePredictionsTable();
    }

    initializePredictionChart() {
        const ctx = document.getElementById('prediction-chart');
        if (ctx && ctx.getContext) {
            const chart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: this.generateTimeLabels(20),
                    datasets: [{
                        label: '실제 가격',
                        data: this.generateMockPriceData(20),
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true
                    }, {
                        label: '예측 가격',
                        data: this.generateMockPriceData(20, 5),
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        fill: false,
                        borderDash: [5, 5]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
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
        // 실시간 뉴스 분석기 사용
        if (window.newsAnalyzer) {
            // 실시간 뉴스 로드
            const latestNews = window.newsAnalyzer.getLatestNews(15);
            const newsSummary = window.newsAnalyzer.generateNewsSummary();
            
            // 감정 분석 차트 업데이트 (실제 데이터 사용)
            this.initializeSentimentChart(newsSummary.sentimentBreakdown);
            
            // 뉴스 피드 업데이트 (실제 뉴스 사용)
            this.updateNewsFeed(latestNews);
            
            // 뉴스 요약 업데이트 (실제 분석 결과 사용)
            this.updateNewsSummary(newsSummary);
            
            // 뉴스 업데이트 이벤트 리스너 설정
            window.addEventListener('newsUpdate', (event) => {
                const { news } = event.detail;
                const summary = window.newsAnalyzer.generateNewsSummary();
                
                this.updateNewsFeed(news.slice(0, 15));
                this.updateNewsSummary(summary);
                this.updateSentimentChart(summary.sentimentBreakdown);
                
                // 알림 표시
                if (window.dashboard && window.dashboard.extensions) {
                    window.dashboard.extensions.showNotification(
                        `${news.length}개의 새로운 뉴스가 분석되었습니다.`, 
                        'info'
                    );
                }
            });
        } else {
            // 폴백: 기존 모의 데이터 사용
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
                    labels: ['긍정', '중립', '부정'],
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
                                    return `${context.label}: ${context.raw}개 (${percentage}%)`;
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
            
            // 실제 뉴스 데이터가 없으면 모의 데이터 사용
            if (!newsToDisplay || newsToDisplay.length === 0) {
                newsToDisplay = [
                    {
                        title: 'Fed 금리 인상 결정, 시장 반응은?',
                        content: '연방준비제도가 기준금리를 0.25% 포인트 인상하며 인플레이션 억제 의지를 보였습니다.',
                        sentiment: 'negative',
                        publishedAt: new Date(Date.now() - 120000).toISOString(), // 2분 전
                        source: 'Reuters',
                        importance: 0.8,
                        url: '#'
                    },
                    {
                        title: 'Apple 새로운 iPhone 모델 발표',
                        content: 'Apple이 혁신적인 기능을 탑재한 새로운 iPhone 시리즈를 공개했습니다.',
                        sentiment: 'positive',
                        publishedAt: new Date(Date.now() - 900000).toISOString(), // 15분 전
                        source: 'Bloomberg',
                        importance: 0.7,
                        url: '#'
                    },
                    {
                        title: 'Tesla 3분기 실적 발표',
                        content: '테슬라가 예상을 뛰어넘는 3분기 실적을 발표하며 주가가 급등했습니다.',
                        sentiment: 'positive',
                        publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
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
                            ${news.confidence ? `<span class="confidence-badge">신뢰도: ${Math.round(news.confidence * 100)}%</span>` : ''}
                        </div>
                        ${news.keywords && news.keywords.length > 0 ? `
                            <div class="news-keywords">
                                ${news.keywords.slice(0, 3).map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
            
            // 뉴스 필터링 이벤트 설정
            this.setupNewsFiltering();
        }
    }

    updateNewsSummary(summaryData = null) {
        const container = document.getElementById('news-summary');
        if (container) {
            let summaries;
            
            if (summaryData && summaryData.keyTrends) {
                // 실제 분석 데이터 사용
                const marketImpactText = this.getMarketImpactText(summaryData.marketImpact);
                const topTrends = summaryData.keyTrends.slice(0, 5).map(trend => trend.keyword).join(', ');
                const totalNews = summaryData.totalNews || 0;
                const sentimentInfo = this.getSentimentSummary(summaryData.sentimentBreakdown);
                
                summaries = [
                    {
                        title: '뉴스 분석 현황',
                        content: `총 ${totalNews}개의 뉴스를 분석했습니다. ${sentimentInfo}`
                    },
                    {
                        title: '주요 트렌드 키워드',
                        content: topTrends ? `${topTrends} 등이 주요 관심사로 부상하고 있습니다.` : '다양한 주제의 뉴스가 고르게 보도되고 있습니다.'
                    },
                    {
                        title: '시장 영향 평가',
                        content: marketImpactText
                    },
                    {
                        title: '업데이트 정보',
                        content: `마지막 분석: ${summaryData.lastUpdate ? new Date(summaryData.lastUpdate).toLocaleTimeString('ko-KR') : '알 수 없음'}`
                    }
                ];
            } else {
                // 기본 요약 정보
                summaries = [
                    {
                        title: '주요 트렌드',
                        content: '오늘 시장은 Fed의 금리 인상 결정으로 인해 변동성이 증가했습니다. 기술주는 하락세를 보이고 있으나, 에너지 섹터는 상승세를 유지하고 있습니다.'
                    },
                    {
                        title: '영향도 높은 뉴스',
                        content: 'Tesla의 3분기 실적 발표와 Apple의 새로운 제품 공개가 시장에 긍정적인 영향을 미치고 있습니다.'
                    },
                    {
                        title: '시장 전망',
                        content: '전문가들은 단기적으로는 변동성이 지속될 것으로 예상하지만, 장기적으로는 안정적인 성장세를 보일 것으로 전망하고 있습니다.'
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

    // 뉴스 관련 유틸리티 메서드들
    getTimeAgo(timestamp) {
        const now = new Date();
        const publishedTime = new Date(timestamp);
        const diffMs = now - publishedTime;
        
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMinutes < 1) return '방금 전';
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        
        return publishedTime.toLocaleDateString('ko-KR');
    }

    getSentimentText(sentiment) {
        const sentimentMap = {
            'positive': '긍정',
            'negative': '부정',
            'neutral': '중립'
        };
        return sentimentMap[sentiment] || '중립';
    }

    getImportanceIndicator(importance) {
        if (importance > 0.8) {
            return '<span class="importance-badge high">⚡ 중요</span>';
        } else if (importance > 0.6) {
            return '<span class="importance-badge medium">📌 주목</span>';
        }
        return '';
    }

    getMarketImpactText(marketImpact) {
        const impactMap = {
            'positive': '전반적으로 긍정적인 뉴스가 많아 시장에 호재로 작용할 것으로 예상됩니다.',
            'negative': '부정적인 뉴스의 비중이 높아 시장에 악재로 작용할 수 있습니다.',
            'neutral': '긍정적 뉴스와 부정적 뉴스가 혼재하여 중립적인 시장 분위기를 보이고 있습니다.'
        };
        return impactMap[marketImpact] || impactMap['neutral'];
    }

    getSentimentSummary(sentimentBreakdown) {
        if (!sentimentBreakdown) return '감정 분석 데이터가 없습니다.';
        
        const total = (sentimentBreakdown.positive || 0) + (sentimentBreakdown.negative || 0) + (sentimentBreakdown.neutral || 0);
        if (total === 0) return '분석할 뉴스가 없습니다.';
        
        const posPerc = Math.round((sentimentBreakdown.positive || 0) / total * 100);
        const negPerc = Math.round((sentimentBreakdown.negative || 0) / total * 100);
        const neutPerc = Math.round((sentimentBreakdown.neutral || 0) / total * 100);
        
        return `긍정 ${posPerc}%, 부정 ${negPerc}%, 중립 ${neutPerc}%의 분포를 보이고 있습니다.`;
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
        // 데이터 테이블 초기화
        this.loadDataTable('stock_data');
        
        // 데이터 통계 업데이트
        this.updateDataStats();
        
        // 데이터 시각화 차트 초기화
        this.initializeDataVisualization();
    }

    loadDataTable(datasetType) {
        const table = document.getElementById('data-table');
        if (table) {
            // 모의 데이터 생성
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
                        'Title': `뉴스 제목 ${i + 1}`,
                        'Sentiment': ['긍정', '부정', '중립'][Math.floor(Math.random() * 3)],
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
                    <div class="stat-label">총 데이터 수</div>
                    <div class="stat-value">12,450</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">마지막 업데이트</div>
                    <div class="stat-value">${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">데이터 품질</div>
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
                    labels: ['1월', '2월', '3월', '4월', '5월'],
                    datasets: [{
                        label: '데이터 수집량',
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
        // 파일 선택 이벤트 설정
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
                // 실제 파일 로드 시도
                const response = await fetch(`../${filePath}`);
                let code;
                
                if (response.ok) {
                    code = await response.text();
                } else {
                    // 파일이 없으면 모의 코드 표시
                    code = this.getMockCode(filePath);
                }
                
                // 언어 감지
                const language = this.detectLanguage(filePath);
                codeDisplay.className = `language-${language}`;
                codeDisplay.textContent = code;
                
                // Prism.js로 구문 강조 적용
                if (window.Prism) {
                    Prism.highlightElement(codeDisplay);
                }
                
            } catch (error) {
                console.error('파일 로드 실패:', error);
                codeDisplay.textContent = '// 파일을 로드할 수 없습니다.';
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
            'dashboard/dashboard.js': `// 대시보드 메인 JavaScript 파일
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
    
    // 차트 설정
    setupCharts() {
        this.setupPerformanceChart();
        this.setupVolumeChart();
    }
}`,
            'src/models/model_training.py': `# 모델 훈련 스크립트
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

class ModelTrainer:
    def __init__(self):
        self.models = {}
        
    def train_random_forest(self, X, y):
        """Random Forest 모델 훈련"""
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
        
        return mockCodes[filePath] || '// 코드를 로드할 수 없습니다.';
    }

    initializeLogsPage() {
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
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }
    }

    initializeSettingsPage() {
        this.loadCurrentSettings();
        this.setupSettingsEvents();
    }

    loadCurrentSettings() {
        // 설정 로드 로직
        const updateInterval = localStorage.getItem('updateInterval') || '5';
        const theme = localStorage.getItem('theme') || 'light';
        const autoRefresh = localStorage.getItem('autoRefresh') !== 'false';
        
        document.getElementById('update-interval').value = updateInterval;
        document.getElementById('theme-selector').value = theme;
        document.getElementById('auto-refresh').checked = autoRefresh;
    }

    setupSettingsEvents() {
        // 설정 이벤트 리스너 설정
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
        
        // 설정 적용
        if (window.dashboard) {
            window.dashboard.updateInterval = parseInt(updateInterval) * 1000;
        }
        
        // 성공 메시지 표시
        this.showAlert('설정이 저장되었습니다.', 'success');
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

    // 유틸리티 메서드들
    generateTimeLabels(count) {
        const labels = [];
        const now = new Date();
        for (let i = count - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
        }
        return labels;
    }

    generateMockPriceData(count, offset = 0) {
        const data = [];
        let basePrice = 150 + offset;
        for (let i = 0; i < count; i++) {
            basePrice += (Math.random() - 0.5) * 5;
            data.push(Math.max(100, basePrice));
        }
        return data;
    }

    initializeXAIPage() {
        if (window.dashboard && window.dashboard.extensions) {
            window.dashboard.extensions.loadXAIData();
        }
    }
}

// 글로벌 라우터 인스턴스 생성
window.router = new Router();