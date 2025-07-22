// 확장된 대시보드 기능들
class DashboardExtensions {
    constructor(dashboardManager) {
        this.dashboard = dashboardManager;
        this.newsCache = [];
        this.sourceFiles = {};
        this.dataEndpoints = {
            stock_data: '../data/raw/training_features.csv',
            news_data: '../data/raw/news_data.csv',
            features: '../data/processed/llm_enhanced_features.csv',
            predictions: '../data/raw/realtime_results.json'
        };

        // 뉴스 업데이트 이벤트 리스너 등록
        window.addEventListener('newsUpdate', (event) => {
            this.newsCache = event.detail.news; // news-analyzer에서 전달된 최신 뉴스 캐시 사용
            this.updateNewsFeedDisplay();
            this.updateLlmAnalysisSummary();
        });
    }

    init() {
        // 초기 뉴스 데이터 로드 및 표시
        this.loadNewsData().then(() => {
            this.updateNewsFeedDisplay();
            this.updateLlmAnalysisSummary();
        });

        // XAI 설명 데이터 로드 및 표시
        this.loadXAIData().then(() => {
            this.updateXAIExplanation();
        });

        // 데이터 탐색기 초기화
        const datasetSelector = document.getElementById('dataset-selector');
        if (datasetSelector) {
            datasetSelector.addEventListener('change', (event) => {
                this.loadAndDisplayDataset(event.target.value);
            });
            // 페이지 로드 시 기본 데이터셋 로드
            this.loadAndDisplayDataset(datasetSelector.value);
        }
    }

    async loadXAIData() {
        try {
            const response = await fetch('../data/raw/monitoring_dashboard.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.xaiData = data; // XAI 데이터를 캐시
        } catch (error) {
            console.error('XAI 데이터 로드 실패:', error);
            this.xaiData = null;
        }
    }

    updateXAIExplanation() {
        const xaiAnalysisContainer = document.getElementById('xai-analysis-container');
        if (!xaiAnalysisContainer || !this.xaiData) {
            console.warn('XAI analysis container or data not available.');
            return;
        }

        // Clear previous content
        // xaiAnalysisContainer.innerHTML = ''; // index.html에서 이미 초기 로딩 텍스트가 있으므로 주석 처리

        // Render each XAI component
        this.renderFeatureImportance();
        this.renderSHAPSummaryPlot();
        this.renderSHAPDependencePlot();
        this.renderSHAPForcePlot();
        this.renderLIMEExplanation();
        this.renderConfusionMatrix();
        this.renderPartialDependencePlot(); // Placeholder
        this.renderCounterfactualWhatIf(); // Placeholder
    }

    renderFeatureImportance() {
        const container = document.getElementById('feature-importance-chart');
        if (!container) return;

        const importanceMethods = this.xaiData.explainability.feature_importance_methods;
        if (!importanceMethods) {
            container.innerHTML = '<p>특성 중요도 데이터를 찾을 수 없습니다.</p>';
            return;
        }

        const rfBuiltin = importanceMethods.random_forest_builtin;
        if (rfBuiltin && Array.isArray(rfBuiltin.features) && Array.isArray(rfBuiltin.importance) && rfBuiltin.features.length > 0) {
            let html = '<h4>특성 중요도 (Random Forest 내장)</h4>';
            html += '<ul class="feature-importance-list">';

            const sortedFeatures = rfBuiltin.features
                .map((name, index) => ({ name, importance: rfBuiltin.importance[index] }))
                .sort((a, b) => b.importance - a.importance);

            sortedFeatures.forEach(feature => {
                html += `
                    <li>
                        <span class="feature-name">${feature.name}</span>
                        <span class="feature-value">${feature.importance.toFixed(4)}</span>
                    </li>
                `;
            });
            html += '</ul>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>Random Forest 내장 특성 중요도 데이터를 찾을 수 없습니다. `src/utils/xai_monitoring.py`를 실행하여 데이터를 생성했는지 확인하세요.</p>';
        }
    }

    renderSHAPSummaryPlot() {
        const container = document.getElementById('shap-summary-plot');
        if (!container) return;

        const shapExplanations = this.xaiData.explainability.shap_explanations;
        if (!shapExplanations || !shapExplanations.random_forest_shap) {
            container.innerHTML = '<p>SHAP 요약 플롯 데이터를 찾을 수 없습니다.</p>';
            return;
        }

        const rfShap = shapExplanations.random_forest_shap;
        const featureNames = this.xaiData.explainability.feature_importance_methods.random_forest_builtin.features;

        if (rfShap && rfShap.shap_values && featureNames) {
            // SHAP 값의 절대값 평균을 특성 중요도로 사용
            const avgShapValues = rfShap.shap_values.map(row => row[1]).reduce((acc, val) => acc.map((sum, i) => sum + Math.abs(val[i])), new Array(featureNames.length).fill(0)).map(sum => sum / rfShap.shap_values.length);

            const sortedFeatures = featureNames
                .map((name, index) => ({ name, value: avgShapValues[index] }))
                .sort((a, b) => b.value - a.value);

            const labels = sortedFeatures.map(f => f.name);
            const data = sortedFeatures.map(f => f.value);

            container.innerHTML = '<canvas id="shapSummaryChart"></canvas>';
            this.createBarChart('shapSummaryChart', 'SHAP 요약 플롯 (Random Forest)', labels, data, 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 1)');
        } else {
            container.innerHTML = '<p>SHAP 요약 플롯 데이터를 로드할 수 없습니다.</p>';
        }
    }

    renderSHAPDependencePlot() {
        const container = document.getElementById('shap-dependence-plot');
        if (!container) return;

        const shapExplanations = this.xaiData.explainability.shap_explanations;
        const predictionData = this.xaiData.explainability.prediction_data;
        if (!shapExplanations || !shapExplanations.random_forest_shap || !predictionData) {
            container.innerHTML = '<p>SHAP 의존성 플롯 데이터를 찾을 수 없습니다.</p>';
            return;
        }

        const rfShap = shapExplanations.random_forest_shap;
        const featureNames = this.xaiData.explainability.feature_importance_methods.random_forest_builtin.features;
        const X_test = predictionData.X_test;

        // 예시: 'volatility' 특성에 대한 의존성 플롯
        const targetFeatureName = 'volatility';
        const targetFeatureIndex = featureNames.indexOf(targetFeatureName);

        if (targetFeatureIndex === -1) {
            container.innerHTML = `<p>특성 '${targetFeatureName}'을(를) 찾을 수 없습니다.</p>`;
            return;
        }

        const scatterData = X_test.map((row, i) => ({
            x: row[targetFeatureIndex],
            y: rfShap.shap_values[i][1][targetFeatureIndex] // 클래스 1에 대한 SHAP 값
        }));

        container.innerHTML = '<canvas id="shapDependenceChart"></canvas>';
        this.createScatterChart(
            'shapDependenceChart',
            `SHAP 의존성 플롯 (${targetFeatureName})`,
            [], // Labels are not used for scatter charts in this way
            scatterData,
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 1)'
        );
    }

    renderSHAPForcePlot() {
        const container = document.getElementById('shap-force-plot');
        if (!container) return;

        const shapExplanations = this.xaiData.explainability.shap_explanations;
        const predictionData = this.xaiData.explainability.prediction_data;
        if (!shapExplanations || !shapExplanations.random_forest_shap || !predictionData) {
            container.innerHTML = '<p>SHAP Force 플롯 데이터를 찾을 수 없습니다.</p>';
            return;
        }

        const rfShap = shapExplanations.random_forest_shap;
        const featureNames = this.xaiData.explainability.feature_importance_methods.random_forest_builtin.features;
        const X_test = predictionData.X_test;

        // 첫 번째 샘플에 대한 Force Plot 요약
        if (rfShap.shap_values.length > 0) {
            const sampleIndex = 0; // 첫 번째 샘플
            const shapValuesForSample = rfShap.shap_values[sampleIndex][1]; // 클래스 1에 대한 SHAP 값
            const baseValue = rfShap.base_value[1]; // 클래스 1에 대한 base value

            let html = '<h4>SHAP Force 플롯 (첫 번째 샘플)</h4>';
            html += '<p>모델의 기본 예측값 (Base Value): <strong>' + baseValue.toFixed(4) + '</strong></p>';
            html += '<p>각 특성이 예측값에 기여한 정도:</p>';
            html += '<ul class="feature-importance-list">';

            const contributions = featureNames
                .map((name, index) => ({ name, value: shapValuesForSample[index] }))
                .filter(f => Math.abs(f.value) > 0.0001) // 0에 가까운 값 필터링
                .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

            contributions.forEach(c => {
                const sign = c.value >= 0 ? '긍정적' : '부정적';
                const color = c.value >= 0 ? 'green' : 'red';
                html += `
                    <li>
                        <span class="feature-name">${c.name}</span>
                        <span class="feature-value" style="color: ${color};">${sign}: ${c.value.toFixed(4)}</span>
                    </li>
                `;
            });
            html += '</ul>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>SHAP Force 플롯 데이터를 로드할 수 없습니다.</p>';
        }
    }

    renderLIMEExplanation() {
        const container = document.getElementById('lime-explanation');
        if (!container) return;

        const limeExplanations = this.xaiData.explainability.lime_explanations;
        if (!limeExplanations || limeExplanations.length === 0) {
            container.innerHTML = '<p>LIME 설명 데이터를 찾을 수 없습니다.</p>';
            return;
        }

        // 첫 번째 LIME 설명만 표시
        const firstLimeExplanation = limeExplanations[0];
        if (firstLimeExplanation && firstLimeExplanation.explanation) {
            let html = '<h4>LIME 설명 (첫 번째 샘플)</h4>';
            html += '<p>예측 확률: ' + firstLimeExplanation.prediction_proba[1].toFixed(4) + '</p>';
            html += '<ul class="feature-importance-list">';

            firstLimeExplanation.explanation.forEach(exp => {
                const feature = exp[0];
                const value = exp[1];
                const sign = value >= 0 ? '긍정적' : '부정적';
                const color = value >= 0 ? 'green' : 'red';
                html += `
                    <li>
                        <span class="feature-name">${feature}</span>
                        <span class="feature-value" style="color: ${color};">${sign}: ${value.toFixed(4)}</span>
                    </li>
                `;
            });
            html += '</ul>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>LIME 설명 데이터를 로드할 수 없습니다.</p>';
        }
    }

    renderConfusionMatrix() {
        const container = document.getElementById('confusion-matrix');
        if (!container) return;

        const predictionData = this.xaiData.explainability.prediction_data;
        if (!predictionData || !predictionData.y_test || !predictionData.predictions) {
            container.innerHTML = '<p>혼동 행렬 데이터를 찾을 수 없습니다.</p>';
            return;
        }

        const y_true = predictionData.y_test;
        const y_pred = predictionData.predictions.random_forest; // Random Forest 예측 사용

        if (!y_pred) {
            container.innerHTML = '<p>Random Forest 예측 데이터를 찾을 수 없습니다.</p>';
            return;
        }

        // 혼동 행렬 계산
        const classes = [0, 1]; // 0: Normal, 1: Event
        const confusionMatrix = Array(classes.length).fill(0).map(() => Array(classes.length).fill(0));

        for (let i = 0; i < y_true.length; i++) {
            const trueIdx = classes.indexOf(y_true[i]);
            const predIdx = classes.indexOf(y_pred[i]);
            if (trueIdx !== -1 && predIdx !== -1) {
                confusionMatrix[trueIdx][predIdx]++;
            }
        }

        // 혼동 행렬 시각화 (테이블)
        let html = '<h4>혼동 행렬 (Random Forest)</h4>';
        html += '<table class="confusion-matrix-table">';
        html += '<thead><tr><th></th><th>예측: 정상 (0)</th><th>예측: 이벤트 (1)</th></tr></thead>';
        html += '<tbody>';
        html += `<tr><th>실제: 정상 (0)</th><td>${confusionMatrix[0][0]} (TN)</td><td>${confusionMatrix[0][1]} (FP)</td></tr>`;
        html += `<tr><th>실제: 이벤트 (1)</th><td>${confusionMatrix[1][0]} (FN)</td><td>${confusionMatrix[1][1]} (TP)</td></tr>`;
        html += '</tbody></table>';

        // 추가 메트릭
        const tn = confusionMatrix[0][0];
        const fp = confusionMatrix[0][1];
        const fn = confusionMatrix[1][0];
        const tp = confusionMatrix[1][1];

        const accuracy = (tn + tp) / (tn + fp + fn + tp);
        const precision = tp / (tp + fp);
        const recall = tp / (tp + fn);
        const f1 = 2 * (precision * recall) / (precision + recall);

        html += '<div class="confusion-matrix-metrics">';
        html += `<p>정확도 (Accuracy): ${accuracy.toFixed(4)}</p>`;
        html += `<p>정밀도 (Precision): ${precision.toFixed(4)}</p>`;
        html += `<p>재현율 (Recall): ${recall.toFixed(4)}</p>`;
        html += `<p>F1-Score: ${f1.toFixed(4)}</p>`;
        html += '</div>';

        container.innerHTML = html;
    }

    renderPartialDependencePlot() {
        const container = document.getElementById('partial-dependence-plot');
        if (container) {
            container.innerHTML = '<h4>부분 의존성 그래프</h4><p>부분 의존성 그래프는 특정 특성(들)이 모델 예측에 미치는 평균적인 영향을 보여줍니다. 이 시각화를 생성하려면 추가적인 계산과 데이터 처리가 필요합니다.</p>';
        }
    }

    renderCounterfactualWhatIf() {
        const container = document.getElementById('counterfactual-what-if');
        if (container) {
            container.innerHTML = '<h4>반사실적/What-if 시각화</h4><p>반사실적 설명은 예측을 변경하기 위해 입력 특성을 최소한으로 변경하는 방법을 보여줍니다. What-if 분석은 특정 시나리오에서 모델 예측이 어떻게 변하는지 탐색합니다. 이 시각화를 생성하려면 복잡한 계산과 사용자 상호작용이 필요합니다.</p>';
        }
    }

    // 뉴스 분석 기능
    async loadNewsData() {

    }

    // Chart.js 헬퍼 함수
    createBarChart(elementId, title, labels, data, backgroundColor, borderColor) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
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
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    }

    createScatterChart(elementId, title, labels, data, backgroundColor, borderColor) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'scatter',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    }

    createHeatmap(elementId, title, labels, data) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return;

        // Chart.js에서 직접적인 히트맵 차트 타입은 없으므로, Bar 차트를 변형하거나 다른 라이브러리 사용 고려
        // 여기서는 간단한 텍스트 기반의 히트맵을 생성하거나, 복잡한 구현을 위해 별도 라이브러리(예: D3.js, Plotly.js)를 사용해야 함
        // 일단은 텍스트로 표시
        let html = `<h4>${title}</h4>`;
        html += '<table class="confusion-matrix-table">';
        html += '<thead><tr><th></th>';
        labels.forEach(label => html += `<th>${label} (예측)</th>`);
        html += '</tr></thead><tbody>';

        labels.forEach((rowLabel, i) => {
            html += `<tr><th>${rowLabel} (실제)</th>`;
            labels.forEach((colLabel, j) => {
                const value = data[i][j];
                html += `<td class="matrix-cell" data-value="${value}">${value}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        document.getElementById(elementId).innerHTML = html;
    }

    // 뉴스 피드 업데이트 및 표시
        try {
            const response = await fetch('../data/raw/news_data.csv');
            let newsData;
            
            if (response.ok) {
                const csvText = await response.text();
                newsData = this.parseCSV(csvText);
            } else {
                newsData = this.generateMockNews();
            }
            
            this.newsCache = newsData;
            return newsData;
        } catch (error) {
            console.warn('뉴스 데이터 로드 실패, 모의 데이터 사용:', error);
            this.newsCache = this.generateMockNews();
            return this.newsCache;
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const entry = {};
                headers.forEach((header, index) => {
                    entry[header.trim()] = values[index]?.trim() || '';
                });
                data.push(entry);
            }
        }
        
        return data; // 모든 데이터 반환
    }

    parseJSON(jsonText) {
        try {
            return JSON.parse(jsonText);
        } catch (error) {
            console.error('JSON 파싱 오류:', error);
            return null;
        }
    }

    generateMockNews() {
        const mockNews = [
            {
                title: 'Fed 금리 인상 결정으로 시장 변동성 증가',
                content: '연방준비제도가 기준금리를 0.25% 포인트 인상하며 인플레이션 억제 의지를 보였습니다. 이로 인해 주식시장에서는 혼조세를 보이고 있으며, 특히 기술주의 하락이 두드러지고 있습니다.',
                sentiment: 'negative',
                sentiment_score: -0.3,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                source: 'Reuters',
                category: 'market'
            },
            {
                title: 'Apple 새로운 iPhone 15 시리즈 공식 발표',
                content: 'Apple이 혁신적인 기능을 탑재한 iPhone 15 시리즈를 공개했습니다. USB-C 포트 적용과 향상된 카메라 성능이 주목받고 있으며, 주가는 발표 후 3% 상승했습니다.',
                sentiment: 'positive',
                sentiment_score: 0.6,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                source: 'Bloomberg',
                category: 'stock'
            },
            {
                title: 'Tesla Q3 실적 발표, 예상치 상회',
                content: '테슬라가 3분기 실적에서 매출과 순이익 모두 시장 예상치를 크게 상회했다고 발표했습니다. 전기차 판매량 증가와 에너지 저장 사업의 성장이 주요 동력이 되었습니다.',
                sentiment: 'positive',
                sentiment_score: 0.8,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                source: 'CNBC',
                category: 'stock'
            },
            {
                title: 'Microsoft AI 투자 확대, 클라우드 사업 강화',
                content: '마이크로소프트가 인공지능 분야 투자를 대폭 확대하고 Azure 클라우드 서비스에 AI 기능을 통합한다고 발표했습니다. OpenAI와의 파트너십도 더욱 강화될 예정입니다.',
                sentiment: 'positive',
                sentiment_score: 0.5,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                source: 'TechCrunch',
                category: 'stock'
            },
            {
                title: '인플레이션 우려로 소비재 섹터 하락세',
                content: '지속되는 인플레이션 압력으로 인해 소비재 기업들의 주가가 일제히 하락했습니다. 원자재 가격 상승과 인건비 증가가 주요 요인으로 분석됩니다.',
                sentiment: 'negative',
                sentiment_score: -0.4,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                source: 'Wall Street Journal',
                category: 'economy'
            }
        ];
        
        return mockNews;
    }

    // 뉴스 피드 업데이트 및 표시
    updateNewsFeedDisplay() {
        const newsFeedContainer = document.getElementById('news-feed');
        if (!newsFeedContainer) return;

        newsFeedContainer.innerHTML = ''; // 기존 뉴스 지우기

        if (this.newsCache.length === 0) {
            newsFeedContainer.innerHTML = '<div class="news-loading">뉴스를 불러오는 중...</div>';
            return;
        }

        this.newsCache.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.setAttribute('data-importance', news.importance || 0.5);

            const sentimentClass = `sentiment-${news.sentiment || 'neutral'}`;
            const publishedDate = news.publishedAt ? new Date(news.publishedAt).toLocaleString('ko-KR') : '날짜 없음';

            newsItem.innerHTML = `
                <div class="news-header">
                    <h4 class="news-title">${news.title}</h4>
                    ${news.importance ? `<span class="importance-badge ${news.importance >= 0.8 ? 'high' : news.importance >= 0.6 ? 'medium' : ''}">중요도: ${news.importance.toFixed(2)}</span>` : ''}
                </div>
                <p class="news-summary">${news.content}</p>
                <div class="news-meta">
                    <span class="news-source">출처: ${news.source || '알 수 없음'}</span>
                    <span class="news-date">${publishedDate}</span>
                    <span class="sentiment-badge ${sentimentClass}">${news.sentiment || '중립'}</span>
                </div>
                ${news.keywords && news.keywords.length > 0 ? `
                    <div class="news-keywords">
                        ${news.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                    </div>
                ` : ''}
            `;
            newsFeedContainer.appendChild(newsItem);
        });
    }

    async generateNewsSummary(newsData) {
        if (!newsData || newsData.length === 0) {
            newsData = await this.loadNewsData();
        }
        
        // 감정 분석 통계
        const sentimentStats = newsData.reduce((acc, news) => {
            const sentiment = news.sentiment || 'neutral';
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
        }, {});
        
        // 카테고리별 통계
        const categoryStats = newsData.reduce((acc, news) => {
            const category = news.category || 'general';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        
        // 주요 트렌드 분석
        const positiveNews = newsData.filter(news => news.sentiment === 'positive');
        const negativeNews = newsData.filter(news => news.sentiment === 'negative');
        
        const summary = {
            totalNews: newsData.length,
            sentimentStats,
            categoryStats,
            mainTrends: [
                {
                    title: '주요 트렌드',
                    content: positiveNews.length > negativeNews.length ? 
                        '전반적으로 긍정적인 시장 분위기가 형성되고 있습니다.' :
                        '시장에 대한 우려가 증가하고 있는 상황입니다.'
                },
                {
                    title: '핫 토픽',
                    content: this.extractHotTopics(newsData)
                },
                {
                    title: '시장 전망',
                    content: this.generateMarketOutlook(newsData)
                }
            ]
        };
        
        return summary;
    }

    extractHotTopics(newsData) {
        const keywords = ['AI', '인공지능', 'iPhone', 'Tesla', '테슬라', 'Fed', '금리', '인플레이션'];
        const topicCounts = {};
        
        newsData.forEach(news => {
            const text = (news.title + ' ' + news.content).toLowerCase();
            keywords.forEach(keyword => {
                if (text.includes(keyword.toLowerCase())) {
                    topicCounts[keyword] = (topicCounts[keyword] || 0) + 1;
                }
            });
        });
        
        const sortedTopics = Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic]) => topic);
        
        return sortedTopics.length > 0 ? 
            `${sortedTopics.join(', ')} 관련 뉴스가 많이 보도되고 있습니다.` :
            '다양한 주제의 뉴스가 고르게 보도되고 있습니다.';
    }

    generateMarketOutlook(newsData) {
        const avgSentiment = newsData.reduce((sum, news) => {
            return sum + (parseFloat(news.sentiment_score) || 0);
        }, 0) / newsData.length;
        
        if (avgSentiment > 0.2) {
            return '긍정적인 뉴스가 많아 단기적으로 상승세를 보일 것으로 예상됩니다.';
        } else if (avgSentiment < -0.2) {
            return '부정적인 뉴스의 영향으로 조정 국면이 지속될 수 있습니다.';
        } else {
            return '혼조세 속에서 변동성이 있는 흐름을 보일 것으로 예상됩니다.';
        }
    }

    // 데이터셋 로드 및 표시
    async loadAndDisplayDataset(datasetName) {
        const dataTable = document.getElementById('data-table');
        const dataStats = document.getElementById('data-stats');
        if (!dataTable || !dataStats) return;

        dataTable.innerHTML = '<tr><td>데이터 로딩 중...</td></tr>';
        dataStats.innerHTML = '';

        const filePath = this.dataEndpoints[datasetName];
        if (!filePath) {
            dataTable.innerHTML = '<tr><td>데이터셋을 찾을 수 없습니다.</td></tr>';
            return;
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data;
            if (filePath.endsWith('.csv')) {
                const csvText = await response.text();
                data = this.parseCSV(csvText);
            } else if (filePath.endsWith('.json')) {
                const jsonText = await response.text();
                data = this.parseJSON(jsonText);
            } else {
                throw new Error('지원하지 않는 파일 형식입니다.');
            }

            if (!data || (Array.isArray(data) && data.length === 0)) {
                dataTable.innerHTML = '<tr><td>데이터가 없습니다.</td></tr>';
                return;
            }

            this.renderDataTable(data, dataTable);
            this.renderDataStats(data, dataStats);

        } catch (error) {
            console.error(`데이터 로드 실패 (${datasetName}):`, error);
            dataTable.innerHTML = `<tr><td>데이터 로드 실패: ${error.message}</td></tr>`;
            dataStats.innerHTML = '';
        }
    }

    renderDataTable(data, tableElement) {
        let headers = [];
        let rowsHtml = '';

        if (Array.isArray(data)) {
            if (data.length > 0) {
                headers = Object.keys(data[0]);
                rowsHtml = data.map(row => `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`).join('');
            }
        } else if (typeof data === 'object' && data !== null) {
            // JSON 객체인 경우 (예: realtime_results.json)
            if (data.predictions && Array.isArray(data.predictions)) {
                headers = Object.keys(data.predictions[0]);
                rowsHtml = data.predictions.map(row => `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`).join('');
            } else {
                // 일반 JSON 객체
                headers = Object.keys(data);
                rowsHtml = `<tr>${headers.map(header => `<td>${data[header]}</td>`).join('')}</tr>`;
            }
        }

        tableElement.innerHTML = `
            <thead>
                <tr>
                    ${headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        `;
    }

    renderDataStats(data, statsElement) {
        let statsHtml = '';
        if (Array.isArray(data)) {
            statsHtml += `<div class="stat-item"><span class="stat-label">총 항목 수:</span><span class="stat-value">${data.length}</span></div>`;
            // 추가적인 통계 (예: 숫자형 데이터의 평균, 최소, 최대 등)를 여기에 추가할 수 있습니다.
        } else if (typeof data === 'object' && data !== null) {
            statsHtml += `<div class="stat-item"><span class="stat-label">키 수:</span><span class="stat-value">${Object.keys(data).length}</span></div>`;
            // JSON 객체에 대한 추가 통계
        }
        statsElement.innerHTML = statsHtml;
    }

    // 소스 코드 뷰어 기능
    async loadSourceFile(filePath) {
        try {
            // 캐시된 파일이 있으면 사용
            if (this.sourceFiles[filePath]) {
                return this.sourceFiles[filePath];
            }
            
            const response = await fetch(`../${filePath}`);
            let content;
            
            if (response.ok) {
                content = await response.text();
            }
            else {
                content = this.getMockSourceCode(filePath);
            }
            
            // 캐시에 저장
            this.sourceFiles[filePath] = {
                content,
                size: content.length,
                lastModified: new Date().toISOString()
            };
            
            return this.sourceFiles[filePath];
        } catch (error) {
            console.error('소스 파일 로드 실패:', error);
            return {
                content: '// 파일을 로드할 수 없습니다.',
                size: 0,
                lastModified: new Date().toISOString()
            };
        }
    }

    getMockSourceCode(filePath) {
        const mockCodes = {
            'dashboard/index.html': `<!DOCTYPE html>\n<html lang="ko">\n<head>\n    <meta charset="UTF-8">\n    <title>AI 주식 예측 대시보드</title>\n    <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n    <div class="dashboard-container">\n        <!-- 대시보드 내용 -->\n    </div>\n</body>\n</html>`,
            'dashboard/styles.css': `/* 대시보드 스타일 */\n.dashboard-container {\n    display: flex;\n    min-height: 100vh;\n}\n\n.sidebar {\n    width: 280px;\n    background: rgba(255, 255, 255, 0.95);\n    backdrop-filter: blur(20px);\n}`,
            'src/models/model_training.py': `# AI 모델 훈련 스크립트\nimport pandas as pd\nimport numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nimport joblib\n\nclass ModelTrainer:\n    def __init__(self):\n        self.models = {}\n        \n    def load_data(self, file_path):\n        """데이터 로드"""\n        return pd.read_csv(file_path)\n        \n    def preprocess_data(self, data):\n        """데이터 전처리"""\n        # 결측값 처리\n        data = data.fillna(0)\n        \n        # 특성 엔지니어링\n        data['volatility'] = data['high'] - data['low']\n        data['price_change'] = data['close'] - data['open']\n        \n        return data\n        \n    def train_random_forest(self, X, y):\n        """Random Forest 모델 훈련"""\n        X_train, X_test, y_train, y_test = train_test_split(\n            X, y, test_size=0.2, random_state=42\n        )\n        \n        model = RandomForestClassifier(\n            n_estimators=100,\n            max_depth=15,\n            random_state=42\n        )\n        \n        model.fit(X_train, y_train)\n        \n        # 모델 저장\n        joblib.dump(model, 'models/random_forest_model.pkl')\n        \n        return model, X_test, y_test`,
            'src/core/data_collection_pipeline.py': `# 데이터 수집 파이프라인\nimport yfinance as yf\nimport pandas as pd\nfrom datetime import datetime, timedelta\nimport requests\n\nclass DataCollectionPipeline:\n    def __init__(self):\n        self.symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']\n        self.data_dir = '../data/raw/'\n        \n    def collect_stock_data(self, symbol, period='1y'):\n        """주식 데이터 수집"""\n        try:\n            stock = yf.Ticker(symbol)\n            data = stock.history(period=period)\n            \n            # 기술적 지표 추가\n            data['SMA_20'] = data['Close'].rolling(window=20).mean()\n            data['SMA_50'] = data['Close'].rolling(window=50).mean()\n            data['RSI'] = self.calculate_rsi(data['Close'])\n            \n            # 파일 저장\n            data.to_csv(f"{self.data_dir}stock_{symbol}.csv")\n            \n            return data\n        except Exception as e:\n            print(f"데이터 수집 실패 {symbol}: {e}")\n            return None\n            \n    def calculate_rsi(self, prices, window=14):\n        """RSI 계산"""\n        delta = prices.diff()\n        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()\n        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()\n        rs = gain / loss\n        rsi = 100 - (100 / (1 + rs))\n        return rsi\n        \n    def collect_news_data(self, api_key):\n        """뉴스 데이터 수집"""\n        url = "https://newsapi.org/v2/everything"\n        params = {\n            'q': 'stock market finance',\n            'sortBy': 'publishedAt',\n            'pageSize': 100,\n            'apiKey': api_key\n        }\n        \n        try:\n            response = requests.get(url, params=params)\n            news_data = response.json()\n            \n            # 데이터 처리 및 저장\n            articles = []\n            for article in news_data.get('articles', []):\n                articles.push({\n                    'title': article['title'],\n                    'description': article['description'],\n                    'source': article['source']['name'],\n                    'publishedAt': article['publishedAt'],\n                    'url': article['url']\n                })\n            \n            df = pd.DataFrame(articles)\n            df.to_csv(f"{self.data_dir}news_data.csv", index=False)\n            \n            return df\n        except Exception as e:\n            print(f"뉴스 데이터 수집 실패: {e}")\n            return None`
        };
        
        return mockCodes[filePath] || `// ${filePath} 파일의 내용입니다.\n// 실제 프로젝트에서는 이 파일의 실제 내용이 표시됩니다.\n\nconsole.log('Hello from ${filePath}');`;
    }

    // 데이터 내보내기 기능
    exportData(format = 'json') {
        const data = {
            timestamp: new Date().toISOString(),
            systemStatus: this.dashboard.generateMockSystemStatus(),
            predictions: this.dashboard.generateMockPredictions(),
            news: this.newsCache.slice(0, 10)
        };
        
        let content, mimeType, filename;
        
        switch(format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                mimeType = 'application/json';
                filename = `dashboard_data_${new Date().toISOString().split('T')[0]}.json`;
                break;
            case 'csv':
                content = this.convertToCSV(data.predictions);
                mimeType = 'text/csv';
                filename = `predictions_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            default:
                content = JSON.stringify(data, null, 2);
                mimeType = 'application/json';
                filename = `dashboard_data.json`;
        }
        
        this.downloadFile(content, filename, mimeType);
    }

    convertToCSV(predictions) {
        if (!predictions.predictions || predictions.predictions.length === 0) {
            return 'No data available';
        }
        
        const headers = ['Symbol', 'Direction', 'Change', 'Confidence'];
        const csvContent = [
            headers.join(','),
            ...predictions.predictions.map(pred => 
                [pred.symbol, pred.direction, pred.change, pred.confidence].join(',')
            )
        ].join('\n');
        
        return csvContent;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 전체 화면 토글
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    // 대시보드 새로고침
    refreshDashboard() {
        this.dashboard.loadInitialData();
        this.dashboard.updateCharts();
        
        // 성공 메시지 표시
        this.showNotification('대시보드가 새로고침되었습니다.', 'success');
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `\n            <span class="notification-message">${message}</span>\n            <button class="notification-close" onclick="this.parentElement.remove()">×</button>\n        `;
        
        // 스타일 설정
        notification.style.cssText = `\n            position: fixed;\n            top: 20px;\n            right: 20px;\n            padding: 15px 20px;\n            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};\n            color: white;\n            border-radius: 8px;\n            box-shadow: 0 4px 12px rgba(0,0,0,0.3);\n            z-index: 10000;\n            display: flex;\n            align-items: center;\n            gap: 10px;\n            animation: slideInRight 0.3s ease;\n        `;
        
        document.body.appendChild(notification);
        
        // 자동 제거
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    // 복사 기능
    async copyCode() {
        const codeElement = document.getElementById('code-display');
        if (codeElement && codeElement.textContent) {
            try {
                await navigator.clipboard.writeText(codeElement.textContent);
                this.showNotification('코드가 클립보드에 복사되었습니다.', 'success');
            } catch (error) {
                this.showNotification('복사에 실패했습니다.', 'error');
            }
        }
    }

    // 파일 다운로드
    async downloadCurrentFile() {
        const fileSelector = document.getElementById('file-selector');
        const filePath = fileSelector?.value;
        
        if (filePath) {
            const fileData = await this.loadSourceFile(filePath);
            const filename = filePath.split('/').pop();
            this.downloadFile(fileData.content, filename, 'text/plain');
        }
    }

    // 로그 지우기
    clearLogs() {
        const logViewer = document.getElementById('log-viewer');
        if (logViewer) {
            logViewer.innerHTML = '<div class="log-entry"><span class="log-message">로그가 지워졌습니다.</span></div>';
            this.showNotification('로그가 지워졌습니다.', 'success');
        }
    }

    // 로그 다운로드
    downloadLogs() {
        const logViewer = document.getElementById('log-viewer');
        if (logViewer) {
            const logs = Array.from(logViewer.children).map(entry => {
                const timestamp = entry.querySelector('.timestamp')?.textContent || '';
                const level = entry.querySelector('.log-level')?.textContent || '';
                const message = entry.querySelector('.log-message')?.textContent || '';
                return `${timestamp} [${level}] ${message}`;
            }).join('\n');
            
            this.downloadFile(logs, `system_logs_${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
        }
    }

    // 현재 데이터 내보내기 (데이터 탐색기용)
    exportCurrentData() {
        const datasetSelector = document.getElementById('dataset-selector');
        const selectedDataset = datasetSelector?.value || 'stock_data';
        
        // 현재 테이블 데이터 추출
        const dataTable = document.getElementById('data-table');
        if (dataTable) {
            const rows = Array.from(dataTable.querySelectorAll('tr'));
            const headers = Array.from(rows[0]?.querySelectorAll('th') || []).map(th => th.textContent);
            const data = rows.slice(1).map(row => 
                Array.from(row.querySelectorAll('td')).map(td => td.textContent)
            );
            
            const csvContent = [
                headers.join(','),
                ...data.map(row => row.join(','))
            ].join('\n');
            
            this.downloadFile(csvContent, `${selectedDataset}_export.csv`, 'text/csv');
        }
    }

    // 설정 저장
    saveSettings() {
        const updateInterval = document.getElementById('update-interval')?.value;
        const theme = document.getElementById('theme-selector')?.value;
        const autoRefresh = document.getElementById('auto-refresh')?.checked;
        const desktopNotifications = document.getElementById('desktop-notifications')?.checked;
        const soundAlerts = document.getElementById('sound-alerts')?.checked;
        const accuracyThreshold = document.getElementById('accuracy-threshold')?.value;
        
        // 로컬 스토리지에 설정 저장
        const settings = {
            updateInterval: parseInt(updateInterval) || 5,
            theme: theme || 'light',
            autoRefresh: autoRefresh !== false,
            desktopNotifications: desktopNotifications !== false,
            soundAlerts: soundAlerts === true,
            accuracyThreshold: parseInt(accuracyThreshold) || 85
        };
        
        localStorage.setItem('dashboardSettings', JSON.stringify(settings));
        
        // 설정 적용
        this.dashboard.updateInterval = settings.updateInterval * 1000;
        
        // 성공 메시지 표시
        this.showNotification('설정이 저장되었습니다.', 'success');
    }

    // 설정 초기화
    resetSettings() {
        localStorage.removeItem('dashboardSettings');
        
        // 기본값으로 리셋
        document.getElementById('update-interval').value = '5';
        document.getElementById('theme-selector').value = 'light';
        document.getElementById('auto-refresh').checked = true;
        document.getElementById('desktop-notifications').checked = true;
        document.getElementById('sound-alerts').checked = false;
        document.getElementById('accuracy-threshold').value = '85';
        
        this.showNotification('설정이 초기화되었습니다.', 'success');
    }

    // LLM 분석 요약 업데이트
    updateLlmAnalysisSummary() {
        const newsSummary = window.newsAnalyzer.generateNewsSummary();
        
        const llmMarketSentimentElem = document.getElementById('llm-market-sentiment');
        const llmEventCategoryElem = document.getElementById('llm-event-category');

        if (llmMarketSentimentElem) {
            llmMarketSentimentElem.textContent = newsSummary.marketImpact || '분석 불가';
        }
        if (llmEventCategoryElem) {
            // 주요 이벤트 카테고리를 텍스트로 표시
            const topCategories = newsSummary.topCategories.map(cat => `${cat.category} (${cat.count})`).join(', ');
            llmEventCategoryElem.textContent = topCategories || '분석 불가';
        }
    }
}

// 확장 기능을 메인 대시보드에 추가
DashboardManager.prototype.initExtensions = function() {
    this.extensions = new DashboardExtensions(this);
    
    // 확장 메서드들을 메인 클래스에 바인딩
    this.exportData = this.extensions.exportData.bind(this.extensions);
    this.toggleFullscreen = this.extensions.toggleFullscreen.bind(this.extensions);
    this.refreshAllData = this.extensions.refreshDashboard.bind(this.extensions);
    this.copyCode = this.extensions.copyCode.bind(this.extensions);
    this.downloadFile = this.extensions.downloadCurrentFile.bind(this.extensions);
    this.clearLogs = this.extensions.clearLogs.bind(this.extensions);
    this.downloadLogs = this.extensions.downloadLogs.bind(this.extensions);
    this.exportCurrentData = this.extensions.exportCurrentData.bind(this.extensions);
    this.saveSettings = this.extensions.saveSettings.bind(this.extensions);
    this.resetSettings = this.extensions.resetSettings.bind(this.extensions);
    this.updateLlmAnalysisSummary = this.extensions.updateLlmAnalysisSummary.bind(this.extensions);
    this.extensions.init(); // 확장 기능 초기화 호출
};