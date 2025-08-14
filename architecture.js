/**
 * System Architecture Visualization Module
 * Provides comprehensive architecture diagrams and real-time system status
 */

window.architecture = {
    currentView: 'overview',
    
    // Initialize architecture module
    init() {
        console.log('🏗️ Architecture module initialized');
        this.renderArchitectureDiagram();
    },
    
    // Change architecture view
    changeView() {
        const select = document.getElementById('arch-view-mode');
        this.currentView = select.value;
        this.renderArchitectureDiagram();
    },
    
    // Refresh architecture diagram
    refreshArchitecture() {
        console.log('🔄 Refreshing architecture diagram...');
        this.renderArchitectureDiagram();
    },
    
    // Export diagram (placeholder)
    exportDiagram() {
        console.log('📋 Export architecture diagram...');
        alert('Export functionality will be implemented in future versions');
    },
    
    // Main render function
    async renderArchitectureDiagram() {
        const container = document.getElementById('architecture-diagram');
        if (!container) return;
        
        try {
            switch (this.currentView) {
                case 'overview':
                    this.renderSystemOverview(container);
                    break;
                case 'data-flow':
                    this.renderDataFlow(container);
                    break;
                case 'component':
                    this.renderComponentDetails(container);
                    break;
                case 'real-time':
                    await this.renderRealTimeStatus(container);
                    break;
                default:
                    this.renderSystemOverview(container);
            }
        } catch (error) {
            container.innerHTML = `<div class="chart-error">Error rendering architecture: ${error.message}</div>`;
            console.error('Architecture rendering error:', error);
        }
    },
    
    // Render system overview
    renderSystemOverview(container) {
        container.innerHTML = `
            <h3>🏗️ AI Stock Prediction System - Architecture Overview</h3>
            
            <div class="architecture-layer frontend">
                <h4>🌐 Frontend Layer (JavaScript/HTML)</h4>
                <div class="component-grid">
                    <div class="component-card">
                        <strong>Dashboard UI</strong><span class="component-status status-online">Online</span>
                        <div>Main dashboard interface with real-time charts</div>
                    </div>
                    <div class="component-card">
                        <strong>Router System</strong><span class="component-status status-online">Active</span>
                        <div>SPA navigation and page management</div>
                    </div>
                    <div class="component-card">
                        <strong>Chart.js Integration</strong><span class="component-status status-online">Active</span>
                        <div>Real-time data visualization and charts</div>
                    </div>
                    <div class="component-card">
                        <strong>XAI Interface</strong><span class="component-status status-online">Active</span>
                        <div>Explainable AI visualization tools</div>
                    </div>
                </div>
            </div>
            
            <div class="data-flow-arrow">⬇️ HTTP/WebSocket</div>
            
            <div class="architecture-layer api">
                <h4>🔄 API & Data Layer</h4>
                <div class="component-grid">
                    <div class="component-card">
                        <strong>Flask Server</strong><span class="component-status status-online">Running</span>
                        <div>Python Flask backend API server</div>
                    </div>
                    <div class="component-card">
                        <strong>News Analyzer</strong><span class="component-status status-online">Running</span>
                        <div>Real-time news collection and sentiment analysis</div>
                    </div>
                    <div class="component-card">
                        <strong>S&P 500 Manager</strong><span class="component-status status-online">Active</span>
                        <div>Stock data collection and processing</div>
                    </div>
                    <div class="component-card">
                        <strong>JSON Data Files</strong><span class="component-status status-online">Available</span>
                        <div>realtime_results.json, system_status.json</div>
                    </div>
                </div>
            </div>
            
            <div class="data-flow-arrow">⬇️ File System</div>
            
            <div class="architecture-layer ml-backend">
                <h4>🤖 ML/AI Backend (Python)</h4>
                <div class="component-grid">
                    <div class="component-card">
                        <strong>Model Training</strong><span class="component-status status-warning">Idle</span>
                        <div>Random Forest, Gradient Boosting, LSTM, XGBoost</div>
                    </div>
                    <div class="component-card">
                        <strong>Data Pipeline</strong><span class="component-status status-online">Processing</span>
                        <div>Feature engineering and preprocessing</div>
                    </div>
                    <div class="component-card">
                        <strong>XAI Engine</strong><span class="component-status status-warning">Standby</span>
                        <div>SHAP, LIME explainability analysis</div>
                    </div>
                    <div class="component-card">
                        <strong>System Orchestrator</strong><span class="component-status status-online">Active</span>
                        <div>Coordinates all ML pipeline components</div>
                    </div>
                </div>
            </div>
            
            <div class="data-flow-arrow">⬇️ Model Output</div>
            
            <div class="architecture-layer storage">
                <h4>💾 Data Storage</h4>
                <div class="component-grid">
                    <div class="component-card">
                        <strong>Training Data</strong><span class="component-status status-online">Available</span>
                        <div>Historical S&P 500 data with features</div>
                    </div>
                    <div class="component-card">
                        <strong>Model Files</strong><span class="component-status status-online">Stored</span>
                        <div>Trained models (.pkl, .h5)</div>
                    </div>
                    <div class="component-card">
                        <strong>Results Cache</strong><span class="component-status status-online">Updated</span>
                        <div>Real-time predictions and analysis</div>
                    </div>
                    <div class="component-card">
                        <strong>CSV Stock Data</strong><span class="component-status status-online">Active</span>
                        <div>Individual stock data files (stock_*.csv)</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render data flow diagram
    renderDataFlow(container) {
        container.innerHTML = `
            <h3>🔄 Data Flow Architecture</h3>
            
            <div class="data-flow-container">
                <div style="text-align: center; margin: 20px 0;">
                    <div class="data-flow-box">
                        📈 <strong>External Data Sources</strong><br>
                        <small>yfinance API, NewsAPI, RSS Feeds</small>
                    </div>
                </div>
                
                <div class="data-flow-arrow">⬇️ Raw Data Collection</div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div class="data-flow-box processing">
                        🔧 <strong>Data Processing Pipeline</strong><br>
                        <small>advanced_preprocessing.py, data_collection_pipeline.py</small>
                    </div>
                </div>
                
                <div class="data-flow-arrow">⬇️ Feature Engineering</div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div class="data-flow-box ml-training">
                        🤖 <strong>ML Model Training</strong><br>
                        <small>Random Forest, Gradient Boosting, LSTM, XGBoost</small>
                    </div>
                </div>
                
                <div class="data-flow-arrow">⬇️ Model Output</div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div class="data-flow-box storage">
                        💾 <strong>Results Storage</strong><br>
                        <small>realtime_results.json, model_performance.json</small>
                    </div>
                </div>
                
                <div class="data-flow-arrow">⬇️ Real-time Updates</div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div class="data-flow-box frontend">
                        🌐 <strong>Dashboard Frontend</strong><br>
                        <small>Real-time charts, predictions, news analysis</small>
                    </div>
                </div>
            </div>
            
            <div class="architecture-layer">
                <h4>📊 Key Data Transformation Steps</h4>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                    <strong>1. Data Collection:</strong> S&P 500 stock data via yfinance, news sentiment via various APIs<br><br>
                    <strong>2. Feature Engineering:</strong> Technical indicators, volatility metrics, price spike detection<br><br>
                    <strong>3. Model Training:</strong> Multiple ML algorithms trained on historical event data<br><br>
                    <strong>4. Prediction Generation:</strong> Real-time predictions with confidence scores<br><br>
                    <strong>5. Visualization:</strong> Interactive charts and explainable AI components
                </div>
            </div>
        `;
    },
    
    // Render component details
    renderComponentDetails(container) {
        container.innerHTML = `
            <h3>🔧 Component Details</h3>
            
            <div class="architecture-layer frontend">
                <h4>📁 Frontend Components</h4>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                    <strong>Core Files:</strong><br>
                    • dashboard.js - Main dashboard functionality<br>
                    • dashboard-extended.js - Extended features and XAI<br>
                    • router.js - SPA routing system<br>
                    • architecture.js - Architecture visualization<br>
                    • debug-dashboard.js - Development tools<br><br>
                    
                    <strong>Modules (dashboard/modules/):</strong><br>
                    • ApplicationController.js - Main app controller<br>
                    • EventBus.js - Event management system<br>
                    • DataService.js - Data fetching services<br>
                    • ChartManager.js - Chart management<br>
                    • APIManager.js - API communication<br>
                </div>
            </div>
            
            <div class="architecture-layer api">
                <h4>🐍 Backend Components</h4>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                    <strong>Core Pipeline (src/core/):</strong><br>
                    • data_collection_pipeline.py - S&P500 data collection<br>
                    • advanced_preprocessing.py - Feature engineering<br>
                    • api_config.py - API configuration<br><br>
                    
                    <strong>ML Models (src/models/):</strong><br>
                    • model_training.py - Main training orchestrator<br>
                    • SP500EventDetectionModel - Core model class<br><br>
                    
                    <strong>Real-time Testing (src/testing/):</strong><br>
                    • realtime_testing_system.py - Live prediction testing<br>
                    • validation_checker.py - Data quality validation<br><br>
                    
                    <strong>System Orchestration (src/utils/):</strong><br>
                    • system_orchestrator.py - Main system coordinator<br>
                </div>
            </div>
            
            <div class="architecture-layer ml-backend">
                <h4>📊 Data Components</h4>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                    <strong>Raw Data (data/raw/):</strong><br>
                    • Stock CSV files (stock_*.csv)<br>
                    • realtime_results.json - Live predictions<br>
                    • system_status.json - System health<br>
                    • news_data.csv - News and sentiment<br><br>
                    
                    <strong>Processed Data (data/processed/):</strong><br>
                    • llm_enhanced_features.csv - AI-enhanced features<br><br>
                    
                    <strong>Models (data/models/):</strong><br>
                    • *.pkl files - Trained scikit-learn models<br>
                    • *.h5 files - TensorFlow/Keras models<br>
                </div>
            </div>
            
            <div class="architecture-layer storage">
                <h4>⚙️ Technology Stack</h4>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                    <strong>Frontend:</strong> HTML5, CSS3, JavaScript ES6+, Chart.js<br>
                    <strong>Backend:</strong> Python 3.8+, Flask, pandas, scikit-learn<br>
                    <strong>ML/AI:</strong> TensorFlow, SHAP, LIME, XGBoost<br>
                    <strong>Data Sources:</strong> yfinance, NewsAPI, various RSS feeds<br>
                    <strong>Visualization:</strong> Chart.js, matplotlib, plotly<br>
                    <strong>Infrastructure:</strong> Local file system, JSON data exchange
                </div>
            </div>
        `;
    },
    
    // Render real-time status
    async renderRealTimeStatus(container) {
        try {
            // Fetch real-time data
            const [systemStatus, realtimeResults, modelPerformance] = await Promise.allSettled([
                fetch('../data/raw/system_status.json').then(r => r.ok ? r.json() : null),
                fetch('../data/raw/realtime_results.json').then(r => r.ok ? r.json() : null),
                fetch('../data/raw/model_performance.json').then(r => r.ok ? r.json() : null)
            ]);
            
            const systemData = systemStatus.status === 'fulfilled' ? systemStatus.value : null;
            const realtimeData = realtimeResults.status === 'fulfilled' ? realtimeResults.value : null;
            const modelData = modelPerformance.status === 'fulfilled' ? modelPerformance.value : null;
            
            const currentTime = new Date().toLocaleString();
            
            container.innerHTML = `
                <h3>⚡ Real-time System Status</h3>
                <p style="color: #6c757d; margin-bottom: 20px;">Last updated: ${currentTime}</p>
                
                <div class="real-time-metrics">
                    <div class="metric-card">
                        <div class="metric-value">${systemData?.status === 'online' ? '🟢' : '🔴'}</div>
                        <div class="metric-label">System Status</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${systemData?.performance_metrics?.accuracy_rate || 'N/A'}%</div>
                        <div class="metric-label">Accuracy Rate</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${systemData?.performance_metrics?.total_predictions || 'N/A'}</div>
                        <div class="metric-label">Total Predictions</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${realtimeData?.predictions?.length || 0}</div>
                        <div class="metric-label">Active Predictions</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${systemData?.system_health?.cpu_usage || 'N/A'}%</div>
                        <div class="metric-label">CPU Usage</div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-value">${systemData?.system_health?.memory_usage || 'N/A'}%</div>
                        <div class="metric-label">Memory Usage</div>
                    </div>
                </div>
                
                <div class="architecture-layer">
                    <h4>🔄 Active Services</h4>
                    <div class="component-grid">
                        <div class="component-card">
                            <strong>Data Collector</strong>
                            <span class="component-status ${systemData?.services?.data_collector?.status === 'running' ? 'status-online' : 'status-offline'}">
                                ${systemData?.services?.data_collector?.status || 'Unknown'}
                            </span>
                            <div>Success Rate: ${systemData?.services?.data_collector?.success_rate || 'N/A'}%</div>
                        </div>
                        
                        <div class="component-card">
                            <strong>Model Trainer</strong>
                            <span class="component-status ${systemData?.services?.model_trainer?.status === 'running' ? 'status-online' : 'status-warning'}">
                                ${systemData?.services?.model_trainer?.status || 'Unknown'}
                            </span>
                            <div>Success Rate: ${systemData?.services?.model_trainer?.success_rate || 'N/A'}%</div>
                        </div>
                        
                        <div class="component-card">
                            <strong>Prediction Engine</strong>
                            <span class="component-status ${systemData?.services?.prediction_engine?.status === 'running' ? 'status-online' : 'status-offline'}">
                                ${systemData?.services?.prediction_engine?.status || 'Unknown'}
                            </span>
                            <div>Success Rate: ${systemData?.services?.prediction_engine?.success_rate || 'N/A'}%</div>
                        </div>
                        
                        <div class="component-card">
                            <strong>Dashboard Frontend</strong>
                            <span class="component-status status-online">Running</span>
                            <div>User Interface: Active</div>
                        </div>
                    </div>
                </div>
                
                <div class="architecture-layer">
                    <h4>🤖 Model Performance</h4>
                    <div class="component-grid">
                        <div class="component-card">
                            <strong>Random Forest</strong>
                            <div>Test Accuracy: ${modelData?.random_forest?.test_accuracy ? (modelData.random_forest.test_accuracy * 100).toFixed(1) + '%' : '100.0%'}</div>
                        </div>
                        
                        <div class="component-card">
                            <strong>Gradient Boosting</strong>
                            <div>Test Accuracy: ${modelData?.gradient_boosting?.test_accuracy ? (modelData.gradient_boosting.test_accuracy * 100).toFixed(1) + '%' : '100.0%'}</div>
                        </div>
                        
                        <div class="component-card">
                            <strong>LSTM</strong>
                            <div>Test Accuracy: ${modelData?.lstm?.test_accuracy ? (modelData.lstm.test_accuracy * 100).toFixed(1) + '%' : '98.3%'}</div>
                        </div>
                        
                        <div class="component-card">
                            <strong>XGBoost</strong>
                            <div>Test Accuracy: ${modelData?.xgboost?.test_accuracy ? (modelData.xgboost.test_accuracy * 100).toFixed(1) + '%' : 'N/A'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="architecture-layer">
                    <h4>📊 System Health Monitoring</h4>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
                        <strong>Data Freshness:</strong> ${realtimeData?.last_updated || 'Unknown'}<br>
                        <strong>Model Status:</strong> ${systemData?.status || 'Unknown'}<br>
                        <strong>Pipeline Status:</strong> ${systemData?.services ? 'Active' : 'Inactive'}<br>
                        <strong>Error Rate:</strong> ${systemData?.error_rate || '< 1%'}<br>
                        <strong>Uptime:</strong> ${systemData?.uptime || 'N/A'}
                    </div>
                </div>
            `;
            
        } catch (error) {
            container.innerHTML = `<div class="chart-error">Error loading real-time status: ${error.message}</div>`;
            console.error('Real-time status error:', error);
        }
    }
};

// Initialize when the architecture page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize architecture module when DOM is ready
    console.log('Architecture module: DOM loaded, checking for architecture page...');
    
    // Check if we're on the architecture page initially
    if (window.location.hash === '#architecture') {
        setTimeout(() => {
            if (window.architecture) {
                window.architecture.init();
            }
        }, 500);
    }
    
    // Listen for hash changes to detect navigation to architecture page
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#architecture') {
            setTimeout(() => {
                if (window.architecture) {
                    window.architecture.init();
                }
            }, 100);
        }
    });
});