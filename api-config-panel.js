// API Configuration and Management Panel
class APIConfigPanel {
    constructor() {
        this.apiManager = window.sp500APIManager;
        this.setupEventListeners();
        this.createConfigPanel();
    }

    createConfigPanel() {
        // Add API configuration section to settings page
        const settingsContainer = document.querySelector('#page-settings .settings-container');
        if (settingsContainer) {
            const apiConfigSection = this.createAPIConfigSection();
            settingsContainer.appendChild(apiConfigSection);
        }
    }

    createAPIConfigSection() {
        const section = document.createElement('div');
        section.className = 'api-config-section';
        section.innerHTML = `
            <h2>📡 S&P 500 API Configuration</h2>
            
            <div class="api-status-panel">
                <h3>API Connection Status</h3>
                <div id="api-status-grid" class="api-status-grid">
                    <div class="api-status-item">
                        <span class="api-name">Alpha Vantage</span>
                        <span class="api-status" id="status-alphaVantage">Testing...</span>
                        <span class="api-limit">5 calls/min (Free)</span>
                    </div>
                    <div class="api-status-item">
                        <span class="api-name">Financial Modeling Prep</span>
                        <span class="api-status" id="status-financialModelingPrep">Testing...</span>
                        <span class="api-limit">250 calls/day (Free)</span>
                    </div>
                    <div class="api-status-item">
                        <span class="api-name">Twelve Data</span>
                        <span class="api-status" id="status-twelveData">Testing...</span>
                        <span class="api-limit">800 calls/day (Free)</span>
                    </div>
                    <div class="api-status-item">
                        <span class="api-name">Polygon.io</span>
                        <span class="api-status" id="status-polygon">Testing...</span>
                        <span class="api-limit">5 calls/min (Free)</span>
                    </div>
                    <div class="api-status-item">
                        <span class="api-name">IEX Cloud</span>
                        <span class="api-status" id="status-iexCloud">Testing...</span>
                        <span class="api-limit">100 calls/month (Free)</span>
                    </div>
                    <div class="api-status-item">
                        <span class="api-name">Yahoo Finance</span>
                        <span class="api-status" id="status-yahooFinance">Testing...</span>
                        <span class="api-limit">Free (Unofficial)</span>
                    </div>
                </div>
                <button class="btn btn-primary" id="test-apis">🔄 Test API Connections</button>
            </div>

            <div class="api-keys-panel">
                <h3>🔑 API Key Management</h3>
                <div class="api-keys-grid">
                    <div class="api-key-item">
                        <label>Alpha Vantage API Key</label>
                        <div class="key-input-group">
                            <input type="password" id="alpha-vantage-key" placeholder="Your Alpha Vantage API key">
                            <button class="btn btn-small" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'">👁️</button>
                        </div>
                        <small>Free: <a href="https://www.alphavantage.co/support/#api-key" target="_blank">Get API Key</a></small>
                    </div>
                    
                    <div class="api-key-item">
                        <label>Financial Modeling Prep API Key</label>
                        <div class="key-input-group">
                            <input type="password" id="fmp-key" placeholder="Your FMP API key">
                            <button class="btn btn-small" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'">👁️</button>
                        </div>
                        <small>Free: <a href="https://financialmodelingprep.com/developer/docs" target="_blank">Get API Key</a></small>
                    </div>
                    
                    <div class="api-key-item">
                        <label>Twelve Data API Key</label>
                        <div class="key-input-group">
                            <input type="password" id="twelve-data-key" placeholder="Your Twelve Data API key">
                            <button class="btn btn-small" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'">👁️</button>
                        </div>
                        <small>Free: <a href="https://twelvedata.com/pricing" target="_blank">Get API Key</a></small>
                    </div>
                    
                    <div class="api-key-item">
                        <label>Polygon.io API Key</label>
                        <div class="key-input-group">
                            <input type="password" id="polygon-key" placeholder="Your Polygon API key">
                            <button class="btn btn-small" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'">👁️</button>
                        </div>
                        <small>Free: <a href="https://polygon.io/pricing" target="_blank">Get API Key</a></small>
                    </div>
                    
                    <div class="api-key-item">
                        <label>IEX Cloud API Key</label>
                        <div class="key-input-group">
                            <input type="password" id="iex-key" placeholder="Your IEX Cloud API key">
                            <button class="btn btn-small" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'">👁️</button>
                        </div>
                        <small>Free: <a href="https://iexcloud.io/pricing" target="_blank">Get API Key</a></small>
                    </div>
                </div>
                
                <div class="api-actions">
                    <button class="btn btn-success" id="save-api-keys">💾 Save API Keys</button>
                    <button class="btn btn-warning" id="clear-api-keys">🗑️ Clear Keys</button>
                </div>
            </div>

            <div class="api-usage-panel">
                <h3>📊 API Usage Status</h3>
                <div id="api-usage-stats" class="usage-stats">
                    <!-- Dynamically generated -->
                </div>
            </div>

            <div class="market-data-panel">
                <h3>📈 Real-time S&P 500 Data</h3>
                <div class="data-controls">
                    <button class="btn" id="refresh-market-data">🔄 Refresh Data</button>
                    <select id="data-update-interval">
                        <option value="30000">Every 30 seconds</option>
                        <option value="60000" selected>Every 1 minute</option>
                        <option value="300000">Every 5 minutes</option>
                        <option value="600000">Every 10 minutes</option>
                    </select>
                </div>
                <div id="market-summary" class="market-summary">
                    <!-- Market summary information -->
                </div>
            </div>

            <div class="api-guide-panel">
                <h3>📖 API Configuration Guide</h3>
                <div class="guide-content">
                    <div class="guide-section">
                        <h4>🚀 Quick Start Guide</h4>
                        <ol>
                            <li><strong>Alpha Vantage</strong>: Easiest starting point. Available immediately after free registration</li>
                            <li><strong>Financial Modeling Prep</strong>: Comprehensive financial data provider</li>
                            <li><strong>Yahoo Finance</strong>: Available immediately without API key (limited)</li>
                        </ol>
                    </div>
                    
                    <div class="guide-section">
                        <h4>💡 Recommended Settings</h4>
                        <ul>
                            <li>Set up at least 2-3 APIs to ensure data stability</li>
                            <li>Adjust update frequency considering free plan limits</li>
                            <li>Use shorter update intervals during important trading hours</li>
                        </ul>
                    </div>

                    <div class="guide-section">
                        <h4>🔐 Security Recommendations</h4>
                        <ul>
                            <li>API keys are stored only in local storage (not sent to server)</li>
                            <li>Regularly regenerate API keys</li>
                            <li>Delete keys after use on shared computers</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    setupEventListeners() {
        // Set up events after DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.attachEventListeners();
        });

        // API data update event listener
        window.addEventListener('sp500DataUpdate', (event) => {
            this.updateMarketSummary(event.detail);
        });
    }

    attachEventListeners() {
        // API connection test button
        const testButton = document.getElementById('test-apis');
        if (testButton) {
            testButton.addEventListener('click', () => this.testAllAPIs());
        }

        // API key save button
        const saveButton = document.getElementById('save-api-keys');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveAPIKeys());
        }

        // API key reset button
        const clearButton = document.getElementById('clear-api-keys');
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearAPIKeys());
        }

        // Data refresh button
        const refreshButton = document.getElementById('refresh-market-data');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.refreshMarketData());
        }

        // Update interval change
        const intervalSelect = document.getElementById('data-update-interval');
        if (intervalSelect) {
            intervalSelect.addEventListener('change', (e) => {
                this.updateDataInterval(parseInt(e.target.value));
            });
        }

        // Load initial data
        this.loadSavedKeys();
        this.updateUsageStats();
        
        // Auto-run API test after 5 seconds
        setTimeout(() => this.testAllAPIs(), 5000);
    }

    // Load saved API keys
    loadSavedKeys() {
        const keyMappings = {
            'alpha-vantage-key': 'alpha_vantage_key',
            'fmp-key': 'fmp_key',
            'twelve-data-key': 'twelve_data_key',
            'polygon-key': 'polygon_key',
            'iex-key': 'iex_key'
        };

        Object.entries(keyMappings).forEach(([inputId, storageKey]) => {
            const input = document.getElementById(inputId);
            const savedKey = localStorage.getItem(storageKey);
            if (input && savedKey) {
                input.value = savedKey;
            }
        });
    }

    // Test all API connections
    async testAllAPIs() {
        const testButton = document.getElementById('test-apis');
        if (testButton) {
            testButton.disabled = true;
            testButton.textContent = 'Testing...';
        }

        try {
            const results = await this.apiManager.testAPIConnections();
            
            // Status update
            Object.entries(results).forEach(([api, status]) => {
                const statusElement = document.getElementById(`status-${api}`);
                if (statusElement) {
                    statusElement.className = `api-status ${status === 'OK' ? 'success' : status === 'NO_KEY' ? 'warning' : 'error'}`;
                    statusElement.textContent = status === 'OK' ? '✅ Connected' : 
                                              status === 'NO_KEY' ? '⚠️ No Key' : 
                                              '❌ Error';
                }
            });

            // Notification for successful APIs count
            const successCount = Object.values(results).filter(status => status === 'OK').length;
            this.showNotification(`${successCount} APIs connected successfully`, 'success');

        } catch (error) {
            console.error('API test failed:', error);
            this.showNotification('Error occurred during API testing', 'error');
        } finally {
            if (testButton) {
                testButton.disabled = false;
                testButton.textContent = '🔄 Test API Connections';
            }
        }
    }

    // Save API keys
    saveAPIKeys() {
        const keyMappings = {
            'alpha-vantage-key': 'alphaVantage',
            'fmp-key': 'financialModelingPrep',
            'twelve-data-key': 'twelveData',
            'polygon-key': 'polygon',
            'iex-key': 'iexCloud'
        };

        let savedCount = 0;

        Object.entries(keyMappings).forEach(([inputId, apiProvider]) => {
            const input = document.getElementById(inputId);
            if (input && input.value.trim()) {
                this.apiManager.setAPIKey(apiProvider, input.value.trim());
                savedCount++;
            }
        });

        if (savedCount > 0) {
            this.showNotification(`${savedCount} API keys saved successfully`, 'success');
            // Automatically run API test
            setTimeout(() => this.testAllAPIs(), 1000);
        } else {
            this.showNotification('No API keys to save', 'warning');
        }
    }

    // Clear API keys
    clearAPIKeys() {
        if (confirm('Are you sure you want to delete all API keys?')) {
            const inputs = ['alpha-vantage-key', 'fmp-key', 'twelve-data-key', 'polygon-key', 'iex-key'];
            const storageKeys = ['alpha_vantage_key', 'fmp_key', 'twelve_data_key', 'polygon_key', 'iex_key'];

            inputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = '';
            });

            storageKeys.forEach(key => {
                localStorage.removeItem(key);
            });

            this.showNotification('API keys have been reset', 'info');
            
            // Reset status
            setTimeout(() => this.testAllAPIs(), 500);
        }
    }

    // Refresh market data
    refreshMarketData() {
        if (this.apiManager) {
            this.apiManager.collectAllData();
            this.showNotification('Refreshing market data', 'info');
        }
    }

    // Change data update interval
    updateDataInterval(intervalMs) {
        if (this.apiManager) {
            this.apiManager.setUpdateInterval(intervalMs);
            this.showNotification(`Update interval changed to ${intervalMs/1000} seconds`, 'success');
        }
    }

    // Update market summary information
    updateMarketSummary(data) {
        const summaryContainer = document.getElementById('market-summary');
        if (summaryContainer && data.analysis) {
            const analysis = data.analysis;
            
            summaryContainer.innerHTML = `
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">Analyzed Stocks</div>
                        <div class="summary-value">${analysis.totalStocks}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Gainers</div>
                        <div class="summary-value success">${analysis.gainers}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Losers</div>
                        <div class="summary-value danger">${analysis.losers}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Average Change</div>
                        <div class="summary-value ${parseFloat(analysis.avgChange) >= 0 ? 'success' : 'danger'}">
                            ${parseFloat(analysis.avgChange) >= 0 ? '+' : ''}${analysis.avgChange}%
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Market Sentiment</div>
                        <div class="summary-value ${analysis.marketSentiment === 'bullish' ? 'success' : analysis.marketSentiment === 'bearish' ? 'danger' : 'info'}">
                            ${analysis.marketSentiment === 'bullish' ? '🐂 Bullish' : analysis.marketSentiment === 'bearish' ? '🐻 Bearish' : '😐 Neutral'}
                        </div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Last Update</div>
                        <div class="summary-value">${new Date(analysis.lastUpdate).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                    </div>
                </div>

                ${analysis.topGainers && analysis.topGainers.length > 0 ? `
                    <div class="top-movers">
                        <h4>📈 Top Gainers</h4>
                        <div class="movers-list">
                            ${analysis.topGainers.slice(0, 3).map(stock => `
                                <div class="mover-item">
                                    <span class="symbol">${stock.symbol}</span>
                                    <span class="change success">+${stock.change.toFixed(2)} (+${stock.changePercent}%)</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${analysis.topLosers && analysis.topLosers.length > 0 ? `
                    <div class="top-movers">
                        <h4>📉 Top Losers</h4>
                        <div class="movers-list">
                            ${analysis.topLosers.slice(0, 3).map(stock => `
                                <div class="mover-item">
                                    <span class="symbol">${stock.symbol}</span>
                                    <span class="change danger">${stock.change.toFixed(2)} (${stock.changePercent}%)</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            `;
        }
    }

    // Update usage statistics
    updateUsageStats() {
        const statsContainer = document.getElementById('api-usage-stats');
        if (statsContainer && this.apiManager) {
            const usage = this.apiManager.getAPIUsage();
            
            statsContainer.innerHTML = `
                <div class="usage-item">
                    <span class="usage-label">Total API Requests</span>
                    <span class="usage-value">${usage.totalRequests}</span>
                </div>
                <div class="usage-item">
                    <span class="usage-label">Active APIs</span>
                    <span class="usage-value">${usage.activeAPIs}/6</span>
                </div>
                <div class="usage-item">
                    <span class="usage-label">Last Update</span>
                    <span class="usage-value">${new Date(usage.lastUpdate).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
            `;
        }
        
        // Update every 1 minute
        setTimeout(() => this.updateUsageStats(), 60000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Use dashboard notification system
        if (window.dashboard && window.dashboard.extensions) {
            window.dashboard.extensions.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
}

// Initialize API configuration panel
document.addEventListener('DOMContentLoaded', () => {
    window.apiConfigPanel = new APIConfigPanel();
});