class DashboardExtended {
    constructor(dashboardManager) {
        this.dashboardManager = dashboardManager;
        this.latestSummaryFile = null;
        this.newsAnalyzer = window.newsAnalyzer || null;
        this.monitoringData = null;
    }

    async init() {
        await this.findLatestTrainingSummary();
        this.setupEventListeners();
        this.loadInitialData();
        if (this.latestSummaryFile) {
            this.loadModelTrainingReport();
        }
        await this.loadXAIMonitoringData();
    }

    setupEventListeners() {
        const datasetSelector = document.getElementById('dataset-selector');
        if (datasetSelector) {
            datasetSelector.addEventListener('change', (event) => {
                this.loadAndDisplayDataset(event.target.value);
            });
        }
    }

    async loadInitialData() {
        try {
            if (this.newsAnalyzer && typeof this.newsAnalyzer.fetchNews === 'function') {
                const newsData = await this.newsAnalyzer.fetchNews();
                this.updateNewsFeedDisplay(newsData);
            } else {
                console.log('NewsAnalyzer not available or fetchNews method missing');
            }
            this.loadAndDisplayDataset('stock_data'); // Load initial dataset
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    updateNewsFeedDisplay(newsData) {
        const newsFeed = document.getElementById('news-feed');
        if (!newsFeed) return;

        newsFeed.innerHTML = newsData.map(article => `
            <div class="news-item">
                <div class="news-item-header">
                    <span class="news-source">${article.source.name}</span>
                    <span class="news-time">${new Date(article.publishedAt).toLocaleString()}</span>
                </div>
                <h4 class="news-title">${article.title}</h4>
                <p class="news-summary">${article.description}</p>
                <div class="news-item-footer">
                     <span class="news-sentiment">Sentiment: ${article.sentiment.label} (${article.sentiment.score.toFixed(2)})</span>
                     <span class="news-importance">Importance: ${article.importance.toFixed(2)}</span>
                     <span class="news-keywords">Keywords: ${article.keywords.join(', ')}</span>
                </div>
            </div>
        `).join('');
    }

    async loadAndDisplayDataset(datasetName) {
        const dataTable = document.getElementById('data-table');
        if (!dataTable) return;

        dataTable.innerHTML = '<tr><td colspan="10">Loading data...</td></tr>';

        try {
            const data = await this.fetchDataset(datasetName);
            const tableHeaders = `<thead><tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}</tr></thead>`;
            const tableBody = `<tbody>${data.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody>`;
            dataTable.innerHTML = tableHeaders + tableBody;
        } catch (error) {
            console.error(`Error loading dataset ${datasetName}:`, error);
            dataTable.innerHTML = '<tr><td colspan="10">Error loading data.</td></tr>';
        }
    }

    async fetchDataset(datasetName) {
        console.log(`Fetching dataset: ${datasetName}`);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (datasetName === 'stock_data') {
            return [
                { Ticker: 'AAPL', Name: 'Apple Inc.', Sector: 'Technology', Price: 150.25, Change: '+1.2%' },
                { Ticker: 'GOOGL', Name: 'Alphabet Inc.', Sector: 'Technology', Price: 2750.50, Change: '-0.5%' },
            ];
        } else if (datasetName === 'news_data') {
            return this.newsAnalyzer.getAnalyzedNews().slice(0, 10).map(a => ({ Title: a.title, Source: a.source.name, Sentiment: a.sentiment.label }));
        }
        return [];
    }

    async findLatestTrainingSummary() {
        // In a real browser environment, we can't use fs.glob. 
        // This needs to be a call to a server endpoint that returns the file list.
        // For this simulation, we'll use the latest file
        this.latestSummaryFile = 'training_summary_20250723_175257.json';
    }

    async loadModelTrainingReport() {
        if (!this.latestSummaryFile) return;
        try {
            const summaryResponse = await fetch(`../data/raw/${this.latestSummaryFile}`);
            const summaryData = await summaryResponse.json();
            this.createTrainingVisualizations(summaryData);
        } catch (error) {
            console.error('Error loading model training report:', error);
        }
    }

    createTrainingVisualizations(data) {
        if (typeof Plotly === 'undefined') {
            console.error("Plotly is not loaded yet.");
            return;
        }
        this.createPerformanceChart(data);
        this.createTrainingTimeChart(data);
        if (data.lstm && data.lstm.history) {
            this.createLstmAccuracyChart(data.lstm.history);
        }
    }

    createPerformanceChart(data) {
        const models = Object.keys(data);
        const metrics = ['precision', 'recall', 'f1-score'];
        const traces = metrics.map(metric => {
            return {
                x: models,
                y: models.map(m => {
                    const report = data[m].test_report;
                    // Safely access weighted_avg or fallback to class "1" metrics
                    const weighted_avg = report.weighted_avg;
                    const class1 = report['1'];
                    return (weighted_avg && weighted_avg[metric]) || (class1 && class1[metric]) || 0;
                }),
                name: metric.charAt(0).toUpperCase() + metric.slice(1),
                type: 'bar'
            };
        });

        const layout = {
            title: 'Model Performance Metrics (Weighted Avg)',
            barmode: 'group',
            xaxis: { title: 'Model' },
            yaxis: { title: 'Score' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e0e0e0' }
        };

        Plotly.newPlot('training-performance-chart', traces, layout);
    }

    createTrainingTimeChart(data) {
        const models = Object.keys(data);
        const times = models.map(m => data[m].training_time_seconds);

        const trace = [{
            x: models,
            y: times,
            type: 'bar',
            marker: {
                color: 'rgba(58, 204, 225, 0.5)'
            }
        }];

        const layout = {
            title: 'Model Training Time',
            xaxis: { title: 'Model' },
            yaxis: { title: 'Time (seconds)' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e0e0e0' }
        };

        Plotly.newPlot('training-time-chart', trace, layout);
    }

    createLstmAccuracyChart(history) {
        const epochs = Array.from({ length: history.accuracy.length }, (_, i) => i + 1);
        const trainAcc = {
            x: epochs,
            y: history.accuracy,
            mode: 'lines',
            name: 'Training Accuracy'
        };
        const valAcc = {
            x: epochs,
            y: history.val_accuracy,
            mode: 'lines',
            name: 'Validation Accuracy'
        };

        const layout = {
            title: 'LSTM Training and Validation Accuracy',
            xaxis: { title: 'Epoch' },
            yaxis: { title: 'Accuracy' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e0e0e0' }
        };

        Plotly.newPlot('lstm-accuracy-chart', [trainAcc, valAcc], layout);
    }

    async loadXAIMonitoringData() {
        try {
            const response = await fetch('../data/raw/monitoring_dashboard.json');
            if (response.ok) {
                this.monitoringData = await response.json();
                console.log('[XAI DEBUG] Monitoring data loaded successfully:', this.monitoringData);
                this.updateXAIDisplays();
            } else {
                console.error('[XAI DEBUG] Failed to load monitoring data:', response.status);
            }
        } catch (error) {
            console.error('[XAI DEBUG] Error loading XAI monitoring data:', error);
        }
    }

    updateXAIDisplays() {
        if (!this.monitoringData) return;
        
        // Update feature importance display
        this.updateFeatureImportanceDisplay();
        
        // Update model confidence display
        this.updateModelConfidenceDisplay();
        
        // Update drift analysis
        this.updateDriftAnalysisDisplay();
    }

    loadXAIData() {
        console.log('[XAI DEBUG] Loading XAI data and rendering charts');
        
        if (!this.monitoringData) {
            console.error('[XAI DEBUG] No monitoring data available');
            return;
        }

        // Render feature importance chart
        this.renderFeatureImportanceChart();
        
        // Render SHAP summary plot
        this.renderSHAPSummaryPlot();
        
        // Render model performance comparison
        this.renderModelPerformanceChart();
        
        // Render prediction confidence chart
        this.renderPredictionConfidenceChart();
    }

    renderFeatureImportanceChart() {
        const container = document.getElementById('feature-importance-chart');
        if (!container) return;

        const explainability = this.monitoringData.explainability;
        if (!explainability || !explainability.feature_importance_methods) return;

        const randomForestImportance = explainability.feature_importance_methods.random_forest_builtin;
        
        const features = Object.keys(randomForestImportance).slice(0, 10);
        const importance = features.map(f => randomForestImportance[f]);

        const data = [{
            x: importance,
            y: features,
            type: 'bar',
            orientation: 'h',
            marker: { color: '#2E86AB' }
        }];

        const layout = {
            title: 'Top 10 Feature Importance (Random Forest)',
            xaxis: { title: 'Importance' },
            margin: { l: 150, r: 50, t: 50, b: 50 },
            height: 400
        };

        Plotly.newPlot('feature-importance-chart', data, layout);
    }

    renderSHAPSummaryPlot() {
        const container = document.getElementById('shap-summary-plot');
        if (!container) return;

        const shapExplanations = this.monitoringData.explainability.shap_explanations;
        if (!shapExplanations) return;

        const features = Object.keys(shapExplanations).slice(0, 8);
        const shapValues = features.map(f => shapExplanations[f]);

        const data = [{
            x: features,
            y: shapValues,
            type: 'bar',
            marker: { color: '#A23B72' }
        }];

        const layout = {
            title: 'SHAP Feature Contributions',
            xaxis: { title: 'Features' },
            yaxis: { title: 'SHAP Value' },
            margin: { l: 50, r: 50, t: 50, b: 100 },
            height: 400
        };

        Plotly.newPlot('shap-summary-plot', data, layout);
    }

    renderModelPerformanceChart() {
        const container = document.getElementById('performance-metrics-chart');
        if (!container) return;

        const performance = this.monitoringData.model_performance;
        if (!performance) return;

        const models = ['random_forest', 'gradient_boosting', 'xgboost', 'lstm'];
        const accuracy = models.map(model => performance.comparison_metrics[model]?.test_accuracy || 0);

        const ctx = container.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: models.map(m => m.replace('_', ' ').toUpperCase()),
                datasets: [{
                    label: 'Test Accuracy',
                    data: accuracy,
                    backgroundColor: '#F18F01',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Test Accuracy'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Model Performance Comparison'
                    }
                }
            }
        });
    }

    renderPredictionConfidenceChart() {
        const container = document.getElementById('confidence-distribution-chart');
        if (!container) return;

        const predictions = this.monitoringData.prediction_data;
        if (!predictions) return;

        const stocks = Object.keys(predictions);
        const confidences = stocks.map(stock => predictions[stock].confidence);

        const ctx = container.getContext('2d');
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Prediction Confidence',
                    data: stocks.map((stock, i) => ({
                        x: i,
                        y: confidences[i]
                    })),
                    backgroundColor: '#2E86AB',
                    borderColor: '#2E86AB'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            callback: function(value, index) {
                                return stocks[Math.floor(value)] || '';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Stock Symbol'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Confidence'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Current Prediction Confidence by Stock'
                    }
                }
            }
        });
    }

    updateFeatureImportanceDisplay() {
        const xaiFeatureImportance = document.getElementById('xai-feature-importance');
        if (!xaiFeatureImportance || !this.monitoringData.explainability) return;
        
        const featureImportanceData = this.monitoringData.explainability.feature_importance_methods;
        
        let html = '<h4>Feature Importance Analysis</h4>';
        
        for (const [method, data] of Object.entries(featureImportanceData)) {
            if (data.importance && data.features) {
                const topFeatures = data.importance
                    .map((importance, index) => ({ feature: data.features[index], importance }))
                    .sort((a, b) => b.importance - a.importance)
                    .slice(0, 5);
                
                html += `<div class="feature-importance-method">`;
                html += `<h5>${method.replace('_', ' ').toUpperCase()}</h5>`;
                html += '<ul>';
                topFeatures.forEach(item => {
                    html += `<li>${item.feature}: ${item.importance.toFixed(4)}</li>`;
                });
                html += '</ul></div>';
            }
        }
        
        xaiFeatureImportance.innerHTML = html;
    }

    updateModelConfidenceDisplay() {
        const xaiModelConfidence = document.getElementById('xai-model-confidence');
        if (!xaiModelConfidence || !this.monitoringData.model_performance) return;
        
        const confidenceMetrics = this.monitoringData.model_performance.confidence_metrics;
        
        let html = '<h4>Model Confidence Analysis</h4>';
        
        for (const [modelName, metrics] of Object.entries(confidenceMetrics)) {
            html += `<div class="confidence-model">`;
            html += `<h5>${modelName.toUpperCase()}</h5>`;
            html += `<p>Mean Confidence: ${(metrics.mean_confidence * 100).toFixed(1)}%</p>`;
            html += `<p>Low Confidence Predictions: ${(metrics.low_confidence_ratio * 100).toFixed(1)}%</p>`;
            html += `<div class="confidence-distribution">`;
            html += `<span class="conf-high">High: ${(metrics.confidence_distribution.high * 100).toFixed(0)}%</span>`;
            html += `<span class="conf-medium">Medium: ${(metrics.confidence_distribution.medium * 100).toFixed(0)}%</span>`;
            html += `<span class="conf-low">Low: ${(metrics.confidence_distribution.low * 100).toFixed(0)}%</span>`;
            html += '</div></div>';
        }
        
        xaiModelConfidence.innerHTML = html;
    }

    updateDriftAnalysisDisplay() {
        const xaiDriftAnalysis = document.getElementById('xai-drift-analysis');
        if (!xaiDriftAnalysis || !this.monitoringData.model_performance) return;
        
        const driftSummary = this.monitoringData.model_performance.feature_drift_summary;
        
        let html = '<h4>Feature Drift Analysis</h4>';
        html += `<p>Total Features: ${driftSummary.total_features}</p>`;
        html += `<p>Drift Detected: ${driftSummary.drift_detected} features</p>`;
        html += `<p>High Severity: ${driftSummary.high_severity_drift} features</p>`;
        
        if (this.monitoringData.alerts && this.monitoringData.alerts.length > 0) {
            html += '<h5>Alerts</h5><ul>';
            this.monitoringData.alerts.forEach(alert => {
                html += `<li class="alert-${alert.severity}">${alert.message}</li>`;
            });
            html += '</ul>';
        }
        
        xaiDriftAnalysis.innerHTML = html;
    }

    renderLocalXaiAnalysis(stockSymbol) {
        console.log(`[XAI DEBUG] Rendering XAI analysis for ${stockSymbol}`);
        
        if (!this.monitoringData) {
            console.error('[XAI DEBUG] No monitoring data available');
            return;
        }
        
        const xaiAnalysisContainer = document.getElementById('xai-analysis-container');
        if (!xaiAnalysisContainer) {
            console.error('[XAI DEBUG] XAI analysis container not found');
            return;
        }
        
        let html = `<div class="xai-analysis-content">`;
        html += `<h3>XAI Analysis for ${stockSymbol}</h3>`;
        
        // Feature importance for the selected stock
        if (this.monitoringData.explainability.feature_importance_methods) {
            html += '<div class="xai-section">';
            html += '<h4>Top Features Affecting Prediction</h4>';
            
            const randomForestImportance = this.monitoringData.explainability.feature_importance_methods.random_forest_builtin;
            if (randomForestImportance) {
                const topFeatures = randomForestImportance.importance
                    .map((imp, idx) => ({ feature: randomForestImportance.features[idx], importance: imp }))
                    .sort((a, b) => b.importance - a.importance)
                    .slice(0, 5);
                
                html += '<ul class="feature-list">';
                topFeatures.forEach(item => {
                    html += `<li><span class="feature-name">${item.feature}</span>: <span class="importance-value">${(item.importance * 100).toFixed(1)}%</span></li>`;
                });
                html += '</ul>';
            }
            html += '</div>';
        }
        
        // Model predictions comparison
        html += '<div class="xai-section">';
        html += '<h4>Model Predictions Comparison</h4>';
        if (this.monitoringData.explainability.prediction_data && this.monitoringData.explainability.prediction_data.predictions) {
            html += '<div class="predictions-grid">';
            Object.entries(this.monitoringData.explainability.prediction_data.predictions).forEach(([modelName, predictions]) => {
                const accuracy = predictions.reduce((acc, pred, idx) => acc + (pred === this.monitoringData.explainability.prediction_data.y_test[idx] ? 1 : 0), 0) / predictions.length;
                html += `<div class="prediction-item">`;
                html += `<span class="model-name">${modelName}</span>`;
                html += `<span class="accuracy">${(accuracy * 100).toFixed(1)}% accuracy</span>`;
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';
        
        // What-if scenarios
        if (this.monitoringData.explainability.counterfactual_what_if) {
            html += '<div class="xai-section">';
            html += '<h4>What-If Scenarios</h4>';
            html += '<div class="what-if-scenarios">';
            this.monitoringData.explainability.counterfactual_what_if.forEach(scenario => {
                html += `<div class="scenario">`;
                html += `<div class="condition">${scenario.condition}</div>`;
                html += `<div class="result">${scenario.result}</div>`;
                html += '</div>';
            });
            html += '</div></div>';
        }
        
        html += '</div>';
        xaiAnalysisContainer.innerHTML = html;
        
        console.log('[XAI DEBUG] XAI analysis rendered successfully');
    }

    refreshXAIData() {
        console.log('[XAI DEBUG] Refreshing XAI data...');
        this.loadXAIMonitoringData();
        
        if (this.dashboardManager) {
            this.dashboardManager.showNotification('XAI data refreshed successfully', 'success');
        }
    }
}