// Datasets Manager for AI Stock Prediction Dashboard
class DatasetsManager {
    constructor() {
        this.currentData = null;
        this.currentPage = 1;
        this.rowsPerPage = 25;
        this.totalRows = 0;
        this.currentFile = null;
        this.currentCategory = null;
        
        this.dataFiles = {
            raw: [
                'training_features.csv',
                'event_labels.csv',
                'news_data.csv',
                'news_sentiment_data.csv',
                'monitoring_dashboard.json',
                'realtime_results.json',
                'system_status.json'
            ],
            processed: [
                'llm_enhanced_features.csv'
            ],
            training: [
                'training_summary.json',
                'training_summary_20250723_173024.json',
                'training_summary_20250723_175257.json'
            ],
            results: [
                'model_performance.json',
                'realtime_test_results.json',
                'validation_report.json',
                'COMPREHENSIVE_MODEL_REPORT.md'
            ]
        };
        
        this.fileStats = {};
    }
    
    init() {
        this.setupEventListeners();
        this.loadDatasetOverview();
    }
    
    setupEventListeners() {
        // Category selector
        const categorySelector = document.getElementById('data-category-selector');
        if (categorySelector) {
            categorySelector.addEventListener('change', (e) => {
                this.loadFilesForCategory(e.target.value);
            });
        }
        
        // File selector
        const fileSelector = document.getElementById('data-file-selector');
        if (fileSelector) {
            fileSelector.addEventListener('change', (e) => {
                this.enableLoadButton(e.target.value);
            });
        }
        
        // Load data button
        const loadBtn = document.getElementById('load-data-btn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadSelectedData();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCurrentData();
            });
        }
        
        // Pagination controls
        const prevBtn = document.getElementById('data-prev-page');
        const nextBtn = document.getElementById('data-next-page');
        const rowsSelect = document.getElementById('data-rows-per-page');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        if (rowsSelect) {
            rowsSelect.addEventListener('change', (e) => {
                this.rowsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderDataTable();
            });
        }
        
        // Visualization controls
        const vizTypeSelector = document.getElementById('viz-type-selector');
        const vizColumnSelector = document.getElementById('viz-column-selector');
        const generateVizBtn = document.getElementById('generate-viz-btn');
        
        if (vizTypeSelector) {
            vizTypeSelector.addEventListener('change', (e) => {
                this.updateColumnSelector(e.target.value);
            });
        }
        
        if (generateVizBtn) {
            generateVizBtn.addEventListener('click', () => {
                this.generateVisualization();
            });
        }
    }
    
    async loadDatasetOverview() {
        try {
            // Load file statistics for each category
            for (const [category, files] of Object.entries(this.dataFiles)) {
                let totalSize = 0;
                let fileCount = 0;
                let lastModified = null;
                
                for (const file of files) {
                    try {
                        const response = await fetch(`../data/${category === 'raw' ? 'raw' : category}/${file}`, {
                            method: 'HEAD'
                        });
                        
                        if (response.ok) {
                            fileCount++;
                            const size = parseInt(response.headers.get('content-length')) || 0;
                            totalSize += size;
                            
                            const modified = response.headers.get('last-modified');
                            if (modified) {
                                const modDate = new Date(modified);
                                if (!lastModified || modDate > lastModified) {
                                    lastModified = modDate;
                                }
                            }
                        }
                    } catch (error) {
                        console.warn(`Could not get stats for ${file}:`, error);
                    }
                }
                
                this.fileStats[category] = {
                    count: fileCount,
                    size: totalSize,
                    lastModified: lastModified
                };
            }
            
            this.updateDatasetCards();
        } catch (error) {
            console.error('Error loading dataset overview:', error);
        }
    }
    
    updateDatasetCards() {
        const categories = ['raw', 'processed', 'training', 'results'];
        
        categories.forEach(category => {
            const stats = this.fileStats[category] || { count: 0, size: 0, lastModified: null };
            
            // Update count
            const countElement = document.getElementById(`${category}-data-count`);
            if (countElement) {
                countElement.textContent = `${stats.count} files`;
            }
            
            // Update size
            const sizeElement = document.getElementById(`${category}-data-size`);
            if (sizeElement) {
                sizeElement.textContent = this.formatFileSize(stats.size);
            }
            
            // Update last modified
            const updatedElement = document.getElementById(`${category}-data-updated`);
            if (updatedElement) {
                updatedElement.textContent = stats.lastModified 
                    ? stats.lastModified.toLocaleDateString()
                    : 'Unknown';
            }
        });
    }
    
    loadFilesForCategory(category) {
        const fileSelector = document.getElementById('data-file-selector');
        const loadBtn = document.getElementById('load-data-btn');
        
        if (!fileSelector) return;
        
        // Clear previous options
        fileSelector.innerHTML = '<option value="">Select File</option>';
        
        if (category && this.dataFiles[category]) {
            fileSelector.disabled = false;
            this.currentCategory = category;
            
            this.dataFiles[category].forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                fileSelector.appendChild(option);
            });
        } else {
            fileSelector.disabled = true;
            this.currentCategory = null;
        }
        
        // Reset load button
        if (loadBtn) {
            loadBtn.disabled = true;
        }
    }
    
    enableLoadButton(fileName) {
        const loadBtn = document.getElementById('load-data-btn');
        const exportBtn = document.getElementById('export-data-btn');
        
        if (loadBtn) {
            loadBtn.disabled = !fileName;
        }
        
        if (exportBtn) {
            exportBtn.disabled = true; // Will be enabled after successful load
        }
    }
    
    async loadSelectedData() {
        const fileSelector = document.getElementById('data-file-selector');
        if (!fileSelector || !fileSelector.value || !this.currentCategory) return;
        
        const fileName = fileSelector.value;
        const category = this.currentCategory;
        
        try {
            const folderPath = category === 'raw' ? 'raw' : category;
            const filePath = `../data/${folderPath}/${fileName}`;
            
            this.showLoadingState();
            
            let data;
            if (fileName.endsWith('.json')) {
                const response = await fetch(filePath);
                data = await response.json();
                this.currentData = this.convertJsonToTabular(data);
            } else if (fileName.endsWith('.csv')) {
                const response = await fetch(filePath);
                const csvText = await response.text();
                this.currentData = this.parseCSV(csvText);
            } else if (fileName.endsWith('.md')) {
                const response = await fetch(filePath);
                const mdText = await response.text();
                this.displayMarkdownContent(mdText);
                return;
            } else {
                throw new Error('Unsupported file format');
            }
            
            this.currentFile = fileName;
            this.currentPage = 1;
            this.totalRows = this.currentData.length;
            
            this.updateDataInfo();
            this.renderDataTable();
            this.calculateStatistics();
            this.assessDataQuality();
            this.updateVisualizationControls();
            
            // Enable export button
            const exportBtn = document.getElementById('export-data-btn');
            if (exportBtn) {
                exportBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError(`Failed to load ${fileName}: ${error.message}`);
        }
    }
    
    convertJsonToTabular(jsonData) {
        if (Array.isArray(jsonData)) {
            return jsonData;
        } else if (typeof jsonData === 'object') {
            // Convert object to array of key-value pairs
            return Object.entries(jsonData).map(([key, value]) => ({
                key: key,
                value: typeof value === 'object' ? JSON.stringify(value) : value
            }));
        } else {
            return [{ data: jsonData }];
        }
    }
    
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });
    }
    
    displayMarkdownContent(mdText) {
        const container = document.getElementById('data-table-container');
        if (container) {
            container.innerHTML = `
                <div class="markdown-content" style="padding: 20px; line-height: 1.6;">
                    <pre style="white-space: pre-wrap; font-family: monospace;">${mdText}</pre>
                </div>
            `;
        }
        
        // Update info
        this.updateDataInfo(null, null, mdText.length);
    }
    
    showLoadingState() {
        const container = document.getElementById('data-table-container');
        if (container) {
            container.innerHTML = `
                <div class="data-placeholder">
                    <div class="loading-spinner" style="margin: 20px auto; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p>Loading data...</p>
                </div>
            `;
        }
    }
    
    showError(message) {
        const container = document.getElementById('data-table-container');
        if (container) {
            container.innerHTML = `
                <div class="data-placeholder" style="color: #dc3545;">
                    <p>❌ ${message}</p>
                </div>
            `;
        }
    }
    
    updateDataInfo(rows = null, columns = null, size = null) {
        const currentFileEl = document.getElementById('current-file');
        const dataRowsEl = document.getElementById('data-rows');
        const dataColumnsEl = document.getElementById('data-columns');
        const dataFileSizeEl = document.getElementById('data-file-size');
        
        if (currentFileEl) currentFileEl.textContent = this.currentFile || 'No file selected';
        if (dataRowsEl) dataRowsEl.textContent = rows !== null ? rows.toLocaleString() : (this.totalRows || 0).toLocaleString();
        if (dataColumnsEl) {
            if (columns !== null) {
                dataColumnsEl.textContent = columns;
            } else if (this.currentData && this.currentData.length > 0) {
                dataColumnsEl.textContent = Object.keys(this.currentData[0]).length;
            } else {
                dataColumnsEl.textContent = '-';
            }
        }
        if (dataFileSizeEl) {
            if (size !== null) {
                dataFileSizeEl.textContent = this.formatFileSize(size);
            } else {
                dataFileSizeEl.textContent = '-';
            }
        }
    }
    
    renderDataTable() {
        if (!this.currentData) return;
        
        const container = document.getElementById('data-table-container');
        if (!container) return;
        
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = Math.min(startIndex + this.rowsPerPage, this.currentData.length);
        const pageData = this.currentData.slice(startIndex, endIndex);
        
        if (pageData.length === 0) {
            container.innerHTML = '<div class="data-placeholder"><p>No data to display</p></div>';
            return;
        }
        
        const columns = Object.keys(pageData[0]);
        
        let tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        ${columns.map(col => `<th>${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${pageData.map(row => `
                        <tr>
                            ${columns.map(col => `<td>${this.formatCellValue(row[col])}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
        this.updatePaginationControls();
    }
    
    formatCellValue(value) {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'string' && value.length > 100) {
            return value.substring(0, 100) + '...';
        }
        return String(value);
    }
    
    updatePaginationControls() {
        const totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
        
        const prevBtn = document.getElementById('data-prev-page');
        const nextBtn = document.getElementById('data-next-page');
        const pageInfo = document.getElementById('data-page-info');
        
        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;
        if (pageInfo) pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderDataTable();
    }
    
    calculateStatistics() {
        if (!this.currentData || this.currentData.length === 0) {
            const statsContainer = document.getElementById('data-stats-content');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stats-placeholder">
                        <p>Load a dataset to view statistics</p>
                    </div>
                `;
            }
            return;
        }
        
        const statsContainer = document.getElementById('data-stats-content');
        if (!statsContainer) return;
        
        const columns = Object.keys(this.currentData[0]);
        const numericColumns = columns.filter(col => {
            const sample = this.currentData.slice(0, 100);
            return sample.some(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]));
        });
        
        const textColumns = columns.filter(col => !numericColumns.includes(col));
        
        let statsHTML = '<div class="stats-overview">';
        
        // Basic overview stats
        statsHTML += `
            <div class="stats-summary">
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <div class="stat-value">${this.currentData.length.toLocaleString()}</div>
                        <div class="stat-label">Total Rows</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📋</div>
                    <div class="stat-content">
                        <div class="stat-value">${columns.length}</div>
                        <div class="stat-label">Total Columns</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔢</div>
                    <div class="stat-content">
                        <div class="stat-value">${numericColumns.length}</div>
                        <div class="stat-label">Numeric Columns</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📝</div>
                    <div class="stat-content">
                        <div class="stat-value">${textColumns.length}</div>
                        <div class="stat-label">Text Columns</div>
                    </div>
                </div>
            </div>
        `;
        
        // Memory usage estimation
        const estimatedSize = this.estimateDataSize();
        statsHTML += `
            <div class="data-memory-info">
                <h4>📈 Data Overview</h4>
                <div class="memory-stats">
                    <div class="memory-item">
                        <span class="memory-label">Estimated Memory:</span>
                        <span class="memory-value">${this.formatFileSize(estimatedSize)}</span>
                    </div>
                    <div class="memory-item">
                        <span class="memory-label">Data Density:</span>
                        <span class="memory-value">${(columns.length * this.currentData.length / 1000).toFixed(1)}K cells</span>
                    </div>
                </div>
            </div>
        `;
        
        // Detailed numeric statistics
        if (numericColumns.length > 0) {
            statsHTML += '<div class="numeric-stats"><h4>🔢 Numeric Column Statistics</h4>';
            statsHTML += '<div class="numeric-stats-grid">';
            
            // Responsive column display: mobile(2), tablet(3), desktop(4)
            const maxColumns = window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4;
            numericColumns.slice(0, maxColumns).forEach(col => {
                const values = this.currentData.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
                if (values.length > 0) {
                    const stats = this.calculateColumnStatistics(values);
                    
                    statsHTML += `
                        <div class="numeric-stat-item">
                            <h5>${col}</h5>
                            <div class="stat-details">
                                <div class="stat-row">
                                    <span>Mean:</span> <strong>${stats.mean}</strong>
                                </div>
                                <div class="stat-row">
                                    <span>Median:</span> <strong>${stats.median}</strong>
                                </div>
                                <div class="stat-row">
                                    <span>Std Dev:</span> <strong>${stats.stdDev}</strong>
                                </div>
                                <div class="stat-row">
                                    <span>Range:</span> <strong>${stats.min} ~ ${stats.max}</strong>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            
            statsHTML += '</div></div>';
        }
        
        // Text column analysis
        if (textColumns.length > 0) {
            statsHTML += '<div class="text-stats"><h4>📝 Text Column Analysis</h4>';
            statsHTML += '<div class="text-stats-grid">';
            
            // Responsive column display: mobile(2), tablet(2), desktop(3)
            const maxTextColumns = window.innerWidth < 1024 ? 2 : 3;
            textColumns.slice(0, maxTextColumns).forEach(col => {
                const textStats = this.analyzeTextColumn(col);
                
                statsHTML += `
                    <div class="text-stat-item">
                        <h5>${col}</h5>
                        <div class="stat-details">
                            <div class="stat-row">
                                <span>Unique Values:</span> <strong>${textStats.uniqueCount}</strong>
                            </div>
                            <div class="stat-row">
                                <span>Avg Length:</span> <strong>${textStats.avgLength} chars</strong>
                            </div>
                            <div class="stat-row">
                                <span>Most Common:</span> <strong>${textStats.mostCommon}</strong>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            statsHTML += '</div></div>';
        }
        
        statsHTML += '</div>';
        statsContainer.innerHTML = statsHTML;
    }
    
    calculateColumnStatistics(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const median = sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
        
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        return {
            mean: mean.toFixed(2),
            median: median.toFixed(2),
            stdDev: stdDev.toFixed(2),
            min: Math.min(...values).toFixed(2),
            max: Math.max(...values).toFixed(2)
        };
    }
    
    analyzeTextColumn(columnName) {
        const values = this.currentData.map(row => String(row[columnName] || '')).filter(v => v.length > 0);
        const uniqueValues = [...new Set(values)];
        const avgLength = values.reduce((acc, val) => acc + val.length, 0) / values.length;
        
        // Find most common value
        const frequency = {};
        values.forEach(val => {
            frequency[val] = (frequency[val] || 0) + 1;
        });
        
        const mostCommonEntry = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])[0];
        const mostCommon = mostCommonEntry ? mostCommonEntry[0].substring(0, 20) + (mostCommonEntry[0].length > 20 ? '...' : '') : 'N/A';
        
        return {
            uniqueCount: uniqueValues.length,
            avgLength: avgLength.toFixed(1),
            mostCommon: mostCommon
        };
    }
    
    estimateDataSize() {
        if (!this.currentData || this.currentData.length === 0) return 0;
        
        // Estimate size based on a sample
        const sample = this.currentData.slice(0, Math.min(100, this.currentData.length));
        let sampleSize = 0;
        
        sample.forEach(row => {
            Object.values(row).forEach(value => {
                if (typeof value === 'string') {
                    sampleSize += value.length * 2; // UTF-16 encoding
                } else if (typeof value === 'number') {
                    sampleSize += 8; // 64-bit number
                } else {
                    sampleSize += JSON.stringify(value).length * 2;
                }
            });
        });
        
        return (sampleSize / sample.length) * this.currentData.length;
    }
    
    assessDataQuality() {
        if (!this.currentData || this.currentData.length === 0) {
            const qualityContainer = document.getElementById('data-quality-content');
            if (qualityContainer) {
                qualityContainer.innerHTML = `
                    <div class="quality-placeholder">
                        <p>Load a dataset to view quality metrics</p>
                    </div>
                `;
            }
            return;
        }
        
        const qualityContainer = document.getElementById('data-quality-content');
        if (!qualityContainer) return;
        
        const columns = Object.keys(this.currentData[0]);
        const qualityMetrics = this.calculateQualityMetrics(columns);
        
        let qualityHTML = '<div class="quality-overview">';
        
        // Overall quality score
        const overallScore = this.calculateOverallQualityScore(qualityMetrics);
        const scoreClass = overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : overallScore >= 40 ? 'warning' : 'poor';
        
        qualityHTML += `
            <div class="quality-header">
                <div class="overall-quality">
                    <div class="quality-score quality-${scoreClass}">
                        <div class="score-value">${overallScore}</div>
                        <div class="score-label">Quality Score</div>
                    </div>
                    <div class="quality-description">
                        ${this.getQualityDescription(overallScore)}
                    </div>
                </div>
            </div>
        `;
        
        // Quality metrics grid
        qualityHTML += '<div class="quality-metrics-grid">';
        
        // Data Completeness
        qualityHTML += `
            <div class="quality-metric-card">
                <div class="metric-header">
                    <div class="metric-icon">📋</div>
                    <h4>Data Completeness</h4>
                </div>
                <div class="metric-value quality-${qualityMetrics.completeness.status}">
                    ${qualityMetrics.completeness.percentage}%
                </div>
                <div class="metric-details">
                    <div class="detail-item">
                        <span>Missing cells:</span>
                        <span>${qualityMetrics.completeness.missingCells.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span>Total cells:</span>
                        <span>${qualityMetrics.completeness.totalCells.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Data Uniqueness
        qualityHTML += `
            <div class="quality-metric-card">
                <div class="metric-header">
                    <div class="metric-icon">🎯</div>
                    <h4>Data Uniqueness</h4>
                </div>
                <div class="metric-value quality-${qualityMetrics.uniqueness.status}">
                    ${qualityMetrics.uniqueness.percentage}%
                </div>
                <div class="metric-details">
                    <div class="detail-item">
                        <span>Unique rows:</span>
                        <span>${qualityMetrics.uniqueness.uniqueRows.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span>Duplicate rows:</span>
                        <span>${qualityMetrics.uniqueness.duplicateRows.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Data Consistency
        qualityHTML += `
            <div class="quality-metric-card">
                <div class="metric-header">
                    <div class="metric-icon">⚖️</div>
                    <h4>Data Consistency</h4>
                </div>
                <div class="metric-value quality-${qualityMetrics.consistency.status}">
                    ${qualityMetrics.consistency.percentage}%
                </div>
                <div class="metric-details">
                    <div class="detail-item">
                        <span>Consistent columns:</span>
                        <span>${qualityMetrics.consistency.consistentColumns}</span>
                    </div>
                    <div class="detail-item">
                        <span>Type mismatches:</span>
                        <span>${qualityMetrics.consistency.typeMismatches}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Data Validity
        qualityHTML += `
            <div class="quality-metric-card">
                <div class="metric-header">
                    <div class="metric-icon">✅</div>
                    <h4>Data Validity</h4>
                </div>
                <div class="metric-value quality-${qualityMetrics.validity.status}">
                    ${qualityMetrics.validity.percentage}%
                </div>
                <div class="metric-details">
                    <div class="detail-item">
                        <span>Valid numeric:</span>
                        <span>${qualityMetrics.validity.validNumeric}%</span>
                    </div>
                    <div class="detail-item">
                        <span>Valid dates:</span>
                        <span>${qualityMetrics.validity.validDates}%</span>
                    </div>
                </div>
            </div>
        `;
        
        qualityHTML += '</div>';
        
        // Detailed column quality report
        const problemColumns = qualityMetrics.columnProblems.filter(col => col.issues.length > 0);
        if (problemColumns.length > 0) {
            qualityHTML += '<div class="column-quality-report">';
            qualityHTML += '<h4>⚠️ Column Quality Issues</h4>';
            qualityHTML += '<div class="column-issues-list">';
            
            // Responsive issue display: mobile(3), tablet(4), desktop(5)
            const maxIssues = window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : 5;
            problemColumns.slice(0, maxIssues).forEach(col => {
                qualityHTML += `
                    <div class="column-issue-item">
                        <div class="column-name">${col.name}</div>
                        <div class="column-issues">
                            ${col.issues.map(issue => `<span class="issue-tag">${issue}</span>`).join('')}
                        </div>
                    </div>
                `;
            });
            
            qualityHTML += '</div></div>';
        }
        
        qualityHTML += '</div>';
        qualityContainer.innerHTML = qualityHTML;
    }
    
    calculateQualityMetrics(columns) {
        const totalCells = this.currentData.length * columns.length;
        let missingCells = 0;
        const columnProblems = [];
        
        // Calculate missing values and analyze each column
        columns.forEach(col => {
            const values = this.currentData.map(row => row[col]);
            const missing = values.filter(val => 
                val === null || val === undefined || val === '' || val === 'null' || val === 'undefined'
            ).length;
            missingCells += missing;
            
            // Analyze column for issues
            const issues = this.analyzeColumnIssues(col, values);
            if (issues.length > 0) {
                columnProblems.push({ name: col, issues });
            }
        });
        
        // Data Completeness
        const completenessPercentage = ((totalCells - missingCells) / totalCells * 100);
        const completenessStatus = completenessPercentage >= 95 ? 'excellent' : 
                                  completenessPercentage >= 80 ? 'good' : 
                                  completenessPercentage >= 60 ? 'warning' : 'poor';
        
        // Data Uniqueness
        const uniqueRows = new Set(this.currentData.map(row => JSON.stringify(row))).size;
        const duplicateRows = this.currentData.length - uniqueRows;
        const uniquenessPercentage = (uniqueRows / this.currentData.length * 100);
        const uniquenessStatus = uniquenessPercentage >= 99 ? 'excellent' : 
                                uniquenessPercentage >= 95 ? 'good' : 
                                uniquenessPercentage >= 85 ? 'warning' : 'poor';
        
        // Data Consistency
        const { consistentColumns, typeMismatches } = this.analyzeDataConsistency(columns);
        const consistencyPercentage = (consistentColumns / columns.length * 100);
        const consistencyStatus = consistencyPercentage >= 90 ? 'excellent' : 
                                 consistencyPercentage >= 75 ? 'good' : 
                                 consistencyPercentage >= 50 ? 'warning' : 'poor';
        
        // Data Validity
        const validity = this.analyzeDataValidity(columns);
        const validityPercentage = ((validity.validNumeric + validity.validDates) / 2);
        const validityStatus = validityPercentage >= 90 ? 'excellent' : 
                              validityPercentage >= 75 ? 'good' : 
                              validityPercentage >= 50 ? 'warning' : 'poor';
        
        return {
            completeness: {
                percentage: completenessPercentage.toFixed(1),
                status: completenessStatus,
                missingCells,
                totalCells
            },
            uniqueness: {
                percentage: uniquenessPercentage.toFixed(1),
                status: uniquenessStatus,
                uniqueRows,
                duplicateRows
            },
            consistency: {
                percentage: consistencyPercentage.toFixed(1),
                status: consistencyStatus,
                consistentColumns,
                typeMismatches
            },
            validity: {
                percentage: validityPercentage.toFixed(1),
                status: validityStatus,
                validNumeric: validity.validNumeric.toFixed(1),
                validDates: validity.validDates.toFixed(1)
            },
            columnProblems
        };
    }
    
    analyzeColumnIssues(columnName, values) {
        const issues = [];
        const nonEmptyValues = values.filter(val => val !== null && val !== undefined && val !== '');
        
        if (nonEmptyValues.length === 0) {
            issues.push('All values missing');
            return issues;
        }
        
        // Check for high missing rate
        const missingRate = (values.length - nonEmptyValues.length) / values.length;
        if (missingRate > 0.5) {
            issues.push(`High missing rate (${(missingRate * 100).toFixed(1)}%)`);
        }
        
        // Check for inconsistent data types
        const types = [...new Set(nonEmptyValues.map(val => typeof val))];
        if (types.length > 2) {
            issues.push('Inconsistent data types');
        }
        
        // Check for outliers in numeric data
        const numericValues = nonEmptyValues.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
        if (numericValues.length > 10) {
            const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
            const stdDev = Math.sqrt(numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericValues.length);
            const outliers = numericValues.filter(val => Math.abs(val - mean) > 3 * stdDev);
            if (outliers.length > numericValues.length * 0.05) {
                issues.push(`Potential outliers (${outliers.length})`);
            }
        }
        
        return issues;
    }
    
    analyzeDataConsistency(columns) {
        let consistentColumns = 0;
        let typeMismatches = 0;
        
        columns.forEach(col => {
            const values = this.currentData.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
            if (values.length === 0) return;
            
            // Check type consistency
            const types = [...new Set(values.map(val => typeof val))];
            if (types.length === 1) {
                consistentColumns++;
            } else {
                typeMismatches++;
            }
        });
        
        return { consistentColumns, typeMismatches };
    }
    
    analyzeDataValidity(columns) {
        let numericColumns = 0;
        let validNumericColumns = 0;
        let dateColumns = 0;
        let validDateColumns = 0;
        
        columns.forEach(col => {
            const values = this.currentData.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
            if (values.length === 0) return;
            
            // Check if column appears to be numeric
            const numericValues = values.filter(val => !isNaN(parseFloat(val)));
            if (numericValues.length > values.length * 0.7) {
                numericColumns++;
                if (numericValues.length === values.length) {
                    validNumericColumns++;
                }
            }
            
            // Check if column appears to be dates
            const dateValues = values.filter(val => !isNaN(Date.parse(val)));
            if (dateValues.length > values.length * 0.7) {
                dateColumns++;
                if (dateValues.length === values.length) {
                    validDateColumns++;
                }
            }
        });
        
        return {
            validNumeric: numericColumns > 0 ? (validNumericColumns / numericColumns * 100) : 100,
            validDates: dateColumns > 0 ? (validDateColumns / dateColumns * 100) : 100
        };
    }
    
    calculateOverallQualityScore(metrics) {
        const weights = {
            completeness: 0.3,
            uniqueness: 0.25,
            consistency: 0.25,
            validity: 0.2
        };
        
        const score = (
            parseFloat(metrics.completeness.percentage) * weights.completeness +
            parseFloat(metrics.uniqueness.percentage) * weights.uniqueness +
            parseFloat(metrics.consistency.percentage) * weights.consistency +
            parseFloat(metrics.validity.percentage) * weights.validity
        );
        
        return Math.round(score);
    }
    
    getQualityDescription(score) {
        if (score >= 80) {
            return "🟢 Excellent data quality - Ready for analysis";
        } else if (score >= 60) {
            return "🟡 Good data quality - Minor issues may need attention";
        } else if (score >= 40) {
            return "🟠 Fair data quality - Several issues should be addressed";
        } else {
            return "🔴 Poor data quality - Significant data cleaning required";
        }
    }
    
    updateVisualizationControls() {
        if (!this.currentData || this.currentData.length === 0) return;
        
        const vizTypeSelector = document.getElementById('viz-type-selector');
        const vizColumnSelector = document.getElementById('viz-column-selector');
        const generateBtn = document.getElementById('generate-viz-btn');
        
        if (vizTypeSelector) vizTypeSelector.disabled = false;
        if (generateBtn) generateBtn.disabled = false;
        
        // Populate column selector
        if (vizColumnSelector) {
            const columns = Object.keys(this.currentData[0]);
            vizColumnSelector.innerHTML = '<option value="">Select Column</option>';
            columns.forEach(col => {
                const option = document.createElement('option');
                option.value = col;
                option.textContent = col;
                vizColumnSelector.appendChild(option);
            });
        }
    }
    
    updateColumnSelector(vizType) {
        const vizColumnSelector = document.getElementById('viz-column-selector');
        if (!vizColumnSelector || !this.currentData) return;
        
        const columns = Object.keys(this.currentData[0]);
        vizColumnSelector.innerHTML = '<option value="">Select Column</option>';
        
        // Filter columns based on visualization type
        let availableColumns = columns;
        if (vizType === 'histogram' || vizType === 'scatter') {
            // Only numeric columns for histograms and scatter plots
            availableColumns = columns.filter(col => {
                const sample = this.currentData.slice(0, 100);
                return sample.some(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]));
            });
        }
        
        availableColumns.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            vizColumnSelector.appendChild(option);
        });
        
        vizColumnSelector.disabled = false;
    }
    
    generateVisualization() {
        const vizType = document.getElementById('viz-type-selector')?.value;
        const column = document.getElementById('viz-column-selector')?.value;
        const container = document.getElementById('visualization-container');
        
        if (!vizType || !container || !this.currentData) return;
        
        container.innerHTML = '<canvas id="data-viz-chart" width="400" height="200"></canvas>';
        const canvas = document.getElementById('data-viz-chart');
        const ctx = canvas.getContext('2d');
        
        try {
            switch (vizType) {
                case 'histogram':
                    this.createHistogram(ctx, column);
                    break;
                case 'line':
                    this.createLineChart(ctx, column);
                    break;
                case 'scatter':
                    this.createScatterPlot(ctx, column);
                    break;
                case 'correlation':
                    this.createCorrelationMatrix(container);
                    break;
                default:
                    container.innerHTML = '<div class="viz-placeholder"><p>Visualization type not implemented</p></div>';
            }
        } catch (error) {
            console.error('Visualization error:', error);
            container.innerHTML = `<div class="viz-placeholder" style="color: #dc3545;"><p>Error generating visualization: ${error.message}</p></div>`;
        }
    }
    
    createHistogram(ctx, column) {
        if (!column) return;
        
        const values = this.currentData
            .map(row => parseFloat(row[column]))
            .filter(v => !isNaN(v));
        
        if (values.length === 0) {
            throw new Error('No numeric data found for histogram');
        }
        
        // Create bins
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
        const binSize = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        values.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
            bins[binIndex]++;
        });
        
        const labels = bins.map((_, i) => (min + i * binSize).toFixed(2));
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: column,
                    data: bins,
                    backgroundColor: 'rgba(0, 123, 255, 0.7)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Histogram of ${column}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequency'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: column
                        }
                    }
                }
            }
        });
    }
    
    createLineChart(ctx, column) {
        if (!column) return;
        
        const data = this.currentData.slice(0, 100).map((row, index) => ({
            x: index,
            y: parseFloat(row[column]) || 0
        }));
        
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: column,
                    data: data,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Line Chart of ${column}`
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Index'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: column
                        }
                    }
                }
            }
        });
    }
    
    createScatterPlot(ctx, column) {
        // For scatter plot, we'll use the column against row index
        const data = this.currentData.slice(0, 100).map((row, index) => ({
            x: index,
            y: parseFloat(row[column]) || 0
        }));
        
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: column,
                    data: data,
                    borderColor: 'rgba(220, 53, 69, 1)',
                    backgroundColor: 'rgba(220, 53, 69, 0.5)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Scatter Plot of ${column}`
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Index'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: column
                        }
                    }
                }
            }
        });
    }
    
    createCorrelationMatrix(container) {
        const numericColumns = Object.keys(this.currentData[0]).filter(col => {
            const sample = this.currentData.slice(0, 100);
            return sample.some(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]));
        });
        
        if (numericColumns.length < 2) {
            container.innerHTML = '<div class="viz-placeholder"><p>Need at least 2 numeric columns for correlation matrix</p></div>';
            return;
        }
        
        // Calculate correlation matrix (simplified)
        const correlations = {};
        numericColumns.forEach(col1 => {
            correlations[col1] = {};
            numericColumns.forEach(col2 => {
                if (col1 === col2) {
                    correlations[col1][col2] = 1;
                } else {
                    // Simplified correlation calculation
                    const values1 = this.currentData.map(row => parseFloat(row[col1])).filter(v => !isNaN(v));
                    const values2 = this.currentData.map(row => parseFloat(row[col2])).filter(v => !isNaN(v));
                    
                    if (values1.length === values2.length && values1.length > 1) {
                        const mean1 = values1.reduce((a, b) => a + b) / values1.length;
                        const mean2 = values2.reduce((a, b) => a + b) / values2.length;
                        
                        let numerator = 0;
                        let sum1 = 0;
                        let sum2 = 0;
                        
                        for (let i = 0; i < values1.length; i++) {
                            const diff1 = values1[i] - mean1;
                            const diff2 = values2[i] - mean2;
                            numerator += diff1 * diff2;
                            sum1 += diff1 * diff1;
                            sum2 += diff2 * diff2;
                        }
                        
                        const denominator = Math.sqrt(sum1 * sum2);
                        correlations[col1][col2] = denominator ? numerator / denominator : 0;
                    } else {
                        correlations[col1][col2] = 0;
                    }
                }
            });
        });
        
        // Create HTML table for correlation matrix
        let tableHTML = '<div style="overflow: auto; max-height: 400px;"><table class="correlation-table" style="width: 100%; border-collapse: collapse;">';
        tableHTML += '<tr><th style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa;"></th>';
        numericColumns.forEach(col => {
            tableHTML += `<th style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-size: 12px;">${col}</th>`;
        });
        tableHTML += '</tr>';
        
        numericColumns.forEach(row => {
            tableHTML += `<tr><th style="padding: 8px; border: 1px solid #ddd; background: #f8f9fa; font-size: 12px;">${row}</th>`;
            numericColumns.forEach(col => {
                const corr = correlations[row][col];
                const color = corr > 0.7 ? '#d4edda' : corr < -0.7 ? '#f8d7da' : '#fff';
                tableHTML += `<td style="padding: 8px; border: 1px solid #ddd; background: ${color}; text-align: center; font-size: 11px;">${corr.toFixed(3)}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</table></div>';
        
        container.innerHTML = tableHTML;
    }
    
    exportCurrentData() {
        if (!this.currentData || !this.currentFile) return;
        
        try {
            let content;
            let filename;
            let mimeType;
            
            if (this.currentFile.endsWith('.json')) {
                content = JSON.stringify(this.currentData, null, 2);
                filename = `exported_${this.currentFile}`;
                mimeType = 'application/json';
            } else {
                // Export as CSV
                const columns = Object.keys(this.currentData[0]);
                const csvContent = [
                    columns.join(','),
                    ...this.currentData.map(row => 
                        columns.map(col => {
                            const value = row[col];
                            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                                return `"${value.replace(/"/g, '""')}"`;
                            }
                            return value;
                        }).join(',')
                    )
                ].join('\n');
                
                content = csvContent;
                filename = `exported_${this.currentFile.replace(/\.[^.]+$/, '.csv')}`;
                mimeType = 'text/csv';
            }
            
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log(`Exported ${filename}`);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data: ' + error.message);
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Add loading spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .correlation-table th,
    .correlation-table td {
        font-size: 11px !important;
        padding: 4px 6px !important;
    }
`;
document.head.appendChild(style);