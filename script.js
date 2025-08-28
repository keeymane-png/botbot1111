
        let cooldowns = {};
        let currentPair = "";
        let signalHistory = JSON.parse(localStorage.getItem('signalHistory')) || [];
        let isDarkTheme = localStorage.getItem('isDarkTheme') !== 'false';
        

        let stats = {
            successRate: 87.3,
            activeSignals: 24,
            successRateHistory: [],
            activeSignalsHistory: []
        };
        
       
        for (let i = 0; i < 30; i++) {
            stats.successRateHistory.push(85 + Math.random() * 5);
            stats.activeSignalsHistory.push(20 + Math.floor(Math.random() * 10));
        }
        
        
        const translations = {
            ru: {
                currencyLabel: "Инструмент",
                timeframeLabel: "Время",
                languageLabel: "Язык",
                themeLabel: "Тёмная тема",
                successRate: "Процент успеха",
                activeSignals: "Активные сигналы",
                signalTitle: "Торговый сигнал",
                chartTitle: "График цены",
                historyTitle: "История сигналов",
                generateButton: "Получить сигнал",
                generating: "Генерация...",
                buy: "ПОКУПКА",
                sell: "ПРОДАЖА",
                timeframe: "Таймфрейм",
                accuracy: "Точность",
                time: "Время",
                noHistory: "Нет сохранённых сигналов",
                darkTheme: "Тёмная тема",
                lightTheme: "Светлая тема",
                telegramBtn: "Telegram",
                timeframes: ["5 секунд", "15 секунд", "1 минута", "3 минуты", "5 минут", "10 минут"],
                signalPlaceholder: "Нажмите 'Получить сигнал' для генерации торгового сигнала",
            },
            en: {
                currencyLabel: "Currency Pair",
                timeframeLabel: "Timeframe",
                languageLabel: "Language",
                themeLabel: "Dark Theme",
                successRate: "Success Rate",
                activeSignals: "Active Signals",
                signalTitle: "Trading Signal",
                chartTitle: "Price Chart",
                historyTitle: "Signal History",
                generateButton: "Generate Signal",
                generating: "Generating...",
                buy: "BUY",
                sell: "SELL",
                timeframe: "Timeframe",
                accuracy: "Accuracy",
                time: "Time",
                noHistory: "No saved signals",
                darkTheme: "Dark Theme",
                lightTheme: "Light Theme",
                telegramBtn: "Telegram",
                timeframes: ["5 seconds", "15 seconds", "1 minute", "3 minutes", "5 minutes", "10 minutes"],
                signalPlaceholder: "Click 'Get Signal' to generate a trading signal",
            },
            uz: {
                currencyLabel: "Valyuta juftligi",
                timeframeLabel: "Vaqt oralig'i",
                languageLabel: "Til",
                themeLabel: "Qora mavzu",
                successRate: "Muvaffaqiyat darajasi",
                activeSignals: "Faol signallar",
                signalTitle: "Savdo signali",
                chartTitle: "Narx grafigi",
                historyTitle: "Signal tarixi",
                generateButton: "Signal olish",
                generating: "Yaratilmoqda...",
                buy: "SOTIB OLISH",
                sell: "SOTISH",
                timeframe: "Vaqt oralig'i",
                accuracy: "Aniqlik",
                time: "Vaqt",
                noHistory: "Saqlangan signallar yo'q",
                darkTheme: "Qora mavzu",
                lightTheme: "Och mavzu",
                telegramBtn: "Telegram",
                timeframes: ["5 soniya", "15 soniya", "1 daqiqa", "3 daqiqa", "5 daqiqa", "10 daqiqa"],
                signalPlaceholder: "Savdo signalini yaratish uchun 'Signal olish' tugmasini bosing"
            }
        };
        
        document.addEventListener("DOMContentLoaded", () => {
            
            const generateButton = document.getElementById("generate-btn");
            const signalResult = document.getElementById("signal-result");
            const signalTime = document.getElementById("signal-time");
            const currencySelect = document.getElementById("currency-pair");
            const themeToggle = document.getElementById("theme-toggle");
            const historyContent = document.getElementById("history-content");
            const clearHistoryBtn = document.getElementById("clear-history");
            
           
            themeToggle.checked = isDarkTheme;
            updateTheme();
            
            
            renderSignalHistory();
            
          
            initChart();
            
          
            startStatsUpdater();
            
         
            generateButton.addEventListener("click", generateSignal);
            currencySelect.addEventListener("change", handleCurrencyChange);
            themeToggle.addEventListener("change", toggleTheme);
            clearHistoryBtn.addEventListener("click", clearHistory);
            document.getElementById("language").addEventListener("change", changeLanguage);
            document.getElementById("chart-timeframe").addEventListener("change", updateChart);
            
        
            updateTranslations(getCurrentLanguage());
        });
        
     
        function startStatsUpdater() {
         
            setInterval(updateStats, 10000);
            
       
            updateStats();
        }
        
    
        function updateStats() {
 
            const successRateChange = (Math.random() - 0.5) * 1;
            const newSuccessRate = Math.max(75, Math.min(95, stats.successRate + successRateChange));
            
         
            const activeSignalsChange = Math.floor(Math.random() * 5) - 2;
            const newActiveSignals = Math.max(15, Math.min(35, stats.activeSignals + activeSignalsChange));
            
       
            stats.successRateHistory.push(newSuccessRate);
            stats.activeSignalsHistory.push(newActiveSignals);
            
     
            if (stats.successRateHistory.length > 30) {
                stats.successRateHistory.shift();
                stats.activeSignalsHistory.shift();
            }
            
       
            const successRateMonthChange = newSuccessRate - stats.successRateHistory[0];
            const activeSignalsDayChange = newActiveSignals - stats.activeSignalsHistory[stats.activeSignalsHistory.length - 2] || 0;
            
      
            stats.successRate = newSuccessRate;
            stats.activeSignals = newActiveSignals;
            
      
            updateStatsDOM(successRateMonthChange, activeSignalsDayChange);
        }
        
       
        function updateStatsDOM(successRateMonthChange, activeSignalsDayChange) {
            const successRateValue = document.getElementById("success-rate-value");
            const successRateChange = document.getElementById("success-rate-change");
            const successRateDiff = document.getElementById("success-rate-diff");
            const successRateTrend = document.getElementById("success-rate-trend");
            
            const activeSignalsValue = document.getElementById("active-signals-value");
            const activeSignalsChange = document.getElementById("active-signals-change");
            const activeSignalsDiff = document.getElementById("active-signals-diff");
            const activeSignalsTrend = document.getElementById("active-signals-trend");
            
     
            successRateValue.classList.add('value-change');
            activeSignalsValue.classList.add('value-change');
            
       
            successRateValue.textContent = stats.successRate.toFixed(1) + '%';
            activeSignalsValue.textContent = stats.activeSignals;
            
       
            const successRatePrefix = successRateMonthChange >= 0 ? '+' : '';
            successRateDiff.textContent = successRatePrefix + successRateMonthChange.toFixed(1) + '%';
            
            const activeSignalsPrefix = activeSignalsDayChange >= 0 ? '+' : '';
            activeSignalsDiff.textContent = activeSignalsPrefix + activeSignalsDayChange;
            
          
            if (successRateMonthChange >= 0) {
                successRateChange.className = 'stat-change green';
                successRateTrend.className = 'stat-trend';
                successRateTrend.textContent = '↑';
            } else {
                successRateChange.className = 'stat-change red';
                successRateTrend.className = 'stat-trend negative';
                successRateTrend.textContent = '↓';
            }
            
            if (activeSignalsDayChange >= 0) {
                activeSignalsChange.className = 'stat-change green';
                activeSignalsTrend.className = 'stat-trend';
                activeSignalsTrend.textContent = '↑';
            } else {
                activeSignalsChange.className = 'stat-change red';
                activeSignalsTrend.className = 'stat-trend negative';
                activeSignalsTrend.textContent = '↓';
            }
            
         
            setTimeout(() => {
                successRateValue.classList.remove('value-change');
                activeSignalsValue.classList.remove('value-change');
            }, 500);
        }
        
   
        function generateSignal() {
            const generateButton = document.getElementById("generate-btn");
            generateButton.disabled = true;
            generateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + translations[getCurrentLanguage()].generating;
            
            const signalResult = document.getElementById("signal-result");
          
            signalResult.classList.add('pulse');
            
            setTimeout(() => {
                const currencyPair = document.getElementById("currency-pair").value;
                const timeframeText = document.getElementById("timeframe").value;
                const cooldownDuration = parseTimeframeToMs(timeframeText);
                
                const isBuy = Math.random() > 0.5;
                const accuracy = (Math.random() * 10 + 85).toFixed(2);
                const now = new Date().toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
                
                const date = new Date();
                const signal = {
                    pair: currencyPair,
                    direction: isBuy ? 'buy' : 'sell',
                    accuracy: accuracy,
                    timeframe: timeframeText,
                    timestamp: date.getTime(),
                    date: date.toLocaleDateString(),
                    time: now
                };
                
            
                signalHistory.unshift(signal);
                if (signalHistory.length > 20) signalHistory.pop();
                localStorage.setItem('signalHistory', JSON.stringify(signalHistory));
                
                renderSignal(signal);
                renderSignalHistory();
                updateChart();
                
             
                updateStats();
                
            
                const endTime = Date.now() + cooldownDuration;
                
                if (cooldowns[currencyPair]?.intervalId) {
                    clearInterval(cooldowns[currencyPair].intervalId);
                }
                
                cooldowns[currencyPair] = { endTime };
                startCooldown(currencyPair);
                
            
                setTimeout(() => signalResult.classList.remove('pulse'), 500);
            }, 1500);
        }
        
      
        function renderSignal(signal) {
            const language = getCurrentLanguage();
            const signalDetails = `
                <div class="signal-details fade-in">
                    <div class="signal-pair">${signal.pair}</div>
                    <div class="signal-direction ${signal.direction === 'buy' ? 'signal-buy' : 'signal-sell'}">
                        ${signal.direction === 'buy' ? translations[language].buy : translations[language].sell}
                    </div>
                    <div class="signal-meta">
                        <div class="signal-meta-item">
                            <div class="signal-meta-label">${translations[language].timeframe}</div>
                            <div class="signal-meta-value">${signal.timeframe}</div>
                        </div>
                        <div class="signal-meta-item">
                            <div class="signal-meta-label">${translations[language].accuracy}</div>
                            <div class="signal-meta-value">${signal.accuracy}%</div>
                        </div>
                        <div class="signal-meta-item">
                            <div class="signal-meta-label">${translations[language].time}</div>
                            <div class="signal-meta-value">${signal.time}</div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("signal-result").innerHTML = signalDetails;
            document.getElementById("signal-time").textContent = signal.time;
        }
        
     
        function handleCurrencyChange() {
            const newPair = document.getElementById("currency-pair").value;
            
            if (cooldowns[currentPair]?.intervalId) {
                clearInterval(cooldowns[currentPair].intervalId);
            }
            
            currentPair = newPair;
            
            if (cooldowns[newPair] && cooldowns[newPair].endTime > Date.now()) {
                startCooldown(newPair);
            } else {
                resetGenerateButton();
            }
            
            updateChart();
        }
        
  
        function startCooldown(pair) {
            const generateButton = document.getElementById("generate-btn");
            
            function updateCooldown() {
                const now = Date.now();
                const remaining = Math.ceil((cooldowns[pair].endTime - now) / 1000);
                const language = getCurrentLanguage();
                
                if (remaining <= 0) {
                    clearInterval(cooldowns[pair].intervalId);
                    resetGenerateButton();
                    delete cooldowns[pair];
                } else {
                    generateButton.disabled = true;
                    generateButton.innerHTML = `<i class="fas fa-clock"></i> ${translations[language].generateButton} (${remaining}s)`;
                }
            }
            
            updateCooldown();
            cooldowns[pair].intervalId = setInterval(updateCooldown, 1000);
        }
        
      
        function resetGenerateButton() {
            const language = getCurrentLanguage();
            const generateButton = document.getElementById("generate-btn");
            generateButton.disabled = false;
            generateButton.innerHTML = `<i class="fas fa-bolt"></i> ${translations[language].generateButton}`;
        }
        
       
        function initChart() {
            updateChart();
        }
        
     
        function updateChart() {
            const currencyPair = document.getElementById("currency-pair").value;
            const timeframe = document.getElementById("chart-timeframe").value;
            generatePriceChart(currencyPair, timeframe);
        }
        
   
        function generatePriceChart(pair, timeframe) {
            const chartElement = document.getElementById('chart');
            const width = chartElement.clientWidth;
            const height = chartElement.clientHeight;
            
        
            d3.select('#chart').selectAll('*').remove();
            
         
            const data = [];
            let currentValue = 100 + Math.random() * 50;
            const volatility = 0.5 + Math.random() * 1.5;
            
            for (let i = 0; i < 50; i++) {
                const change = (Math.random() - 0.5) * volatility;
                currentValue += change;
                data.push({
                    time: i,
                    value: currentValue
                });
            }
            
      
            const svg = d3.select('#chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
            
        
            const margin = { top: 20, right: 30, bottom: 30, left: 50 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            
    
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
            
      
            const xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d.time))
                .range([0, innerWidth]);
            
            const yScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.value) * 0.99, d3.max(data, d => d.value) * 1.01])
                .range([innerHeight, 0]);
            
   
            const line = d3.line()
                .x(d => xScale(d.time))
                .y(d => yScale(d.value))
                .curve(d3.curveMonotoneX);
            
        
            const area = d3.area()
                .x(d => xScale(d.time))
                .y0(innerHeight)
                .y1(d => yScale(d.value))
                .curve(d3.curveMonotoneX);
            
    
            const defs = svg.append('defs');
            const gradient = defs.append('linearGradient')
                .attr('id', 'area-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');
            
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', 'var(--accent-blue)')
                .attr('stop-opacity', 0.3);
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', 'var(--accent-blue)')
                .attr('stop-opacity', 0);
            
         
            g.append('path')
                .datum(data)
                .attr('class', 'area')
                .attr('d', area);
            
       
            g.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', line);
            
        
            const xAxis = d3.axisBottom(xScale)
                .ticks(5)
                .tickFormat(d => `${d}:00`);
            
            const yAxis = d3.axisLeft(yScale)
                .ticks(5);
            
            g.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(xAxis);
            
            g.append('g')
                .attr('class', 'axis')
                .call(yAxis);
            
       
            g.append('text')
                .attr('x', innerWidth / 2)
                .attr('y', -5)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('fill', 'var(--text-secondary)')
                .text(`${pair} (${timeframe})`);
        }
        
    
        function renderSignalHistory() {
            const historyContent = document.getElementById("history-content");
            if (signalHistory.length === 0) {
                historyContent.innerHTML = '<div class="history-empty">' + translations[getCurrentLanguage()].noHistory + '</div>';
                return;
            }
            
            let historyHTML = '';
            signalHistory.forEach(signal => {
                historyHTML += `
                    <div class="history-item">
                        <div class="history-pair">${signal.pair}</div>
                        <div class="history-direction ${signal.direction === 'buy' ? 'history-buy' : 'history-sell'}">
                            ${signal.direction === 'buy' ? translations[getCurrentLanguage()].buy : translations[getCurrentLanguage()].sell}
                        </div>
                        <div class="history-accuracy">${signal.accuracy}%</div>
                        <div class="history-time">${signal.time}</div>
                    </div>
                `;
            });
            
            historyContent.innerHTML = historyHTML;
        }
        

        function clearHistory() {
            signalHistory = [];
            localStorage.setItem('signalHistory', JSON.stringify(signalHistory));
            renderSignalHistory();
        }
        
   
        function toggleTheme() {
            isDarkTheme = document.getElementById("theme-toggle").checked;
            localStorage.setItem('isDarkTheme', isDarkTheme);
            updateTheme();
        }
        
     
        function updateTheme() {
            if (isDarkTheme) {
                document.body.classList.remove('light-theme');
                document.querySelector('#theme-label').textContent = translations[getCurrentLanguage()].darkTheme;
            } else {
                document.body.classList.add('light-theme');
                document.querySelector('#theme-label').textContent = translations[getCurrentLanguage()].lightTheme;
            }
            
      
            updateChart();
        }
        
 
        function getCurrentLanguage() {
            return document.getElementById("language").value;
        }
        
       
        function parseTimeframeToMs(timeframeText) {
    const lowercase = timeframeText.toLowerCase();
    const numberMatch = lowercase.match(/\d+/);
    const value = numberMatch ? parseInt(numberMatch[0], 10) : 30;
    
  
    if (lowercase.includes("second") || lowercase.includes("seconds") || 
        lowercase.includes("секунд") || lowercase.includes("секунда") ||
        lowercase.includes("soniya")) {
        return value * 1000;
    }
    if (lowercase.includes("minute") || lowercase.includes("minutes") || 
        lowercase.includes("минут") || lowercase.includes("минута") ||
        lowercase.includes("minut") || lowercase.includes("daqiqa")) {
        return value * 60 * 1000;
    }
    if (lowercase.includes("hour") || lowercase.includes("hours") || 
        lowercase.includes("час") || lowercase.includes("часа") ||
        lowercase.includes("soat")) {
        return value * 60 * 60 * 1000;
    }
    return 30 * 1000; 
}
        
       
      
function changeLanguage() {
    const language = getCurrentLanguage();
    updateTranslations(language);
    updateTimeframeOptions(); 
    updateTheme();
    
 
    const generateButton = document.getElementById("generate-btn");
    if (generateButton.disabled) {
        const pair = document.getElementById("currency-pair").value;
        if (cooldowns[pair] && cooldowns[pair].endTime > Date.now()) {
            startCooldown(pair);
        }
    }
}
        
       
        function updateTranslations(language) {
    const t = translations[language];
    
    document.getElementById("currency-label").innerHTML = '<i class="fas fa-chart-line"></i> ' + t.currencyLabel;
    document.getElementById("timeframe-label").innerHTML = '<i class="fas fa-clock"></i> ' + t.timeframeLabel;
    document.getElementById("language-label").innerHTML = '<i class="fas fa-globe"></i> ' + t.languageLabel;
    document.getElementById("theme-label").innerHTML = '<i class="fas fa-moon"></i> ' + t.themeLabel;
    document.getElementById("success-rate-label").textContent = t.successRate;
    document.getElementById("active-signals-label").textContent = t.activeSignals;
    document.getElementById("signal-title").textContent = t.signalTitle;
    document.getElementById("chart-title").textContent = t.chartTitle;
    document.getElementById("history-title").textContent = t.historyTitle;
    
    const generateButton = document.getElementById("generate-btn");
    generateButton.innerHTML = '<i class="fas fa-bolt"></i> ' + t.generateButton;
    
    const telegramBtn = document.querySelector('.telegram-btn');
    if (telegramBtn) telegramBtn.innerHTML = '<i class="fab fa-telegram"></i> ' + t.telegramBtn;
    
    const signalPlaceholder = document.querySelector('.signal-placeholder');
if (signalPlaceholder) {
    signalPlaceholder.textContent = t.signalPlaceholder;
}

   
    renderSignalHistory();
}
        function updateTimeframeOptions() {
    const timeframeSelect = document.getElementById("timeframe");
    const language = getCurrentLanguage();
    const timeframes = translations[language].timeframes;
    
   
    const currentValue = timeframeSelect.value;
    
 
    timeframeSelect.innerHTML = "";
    
    timeframes.forEach(timeframe => {
        const option = document.createElement("option");
        option.value = timeframe;
        option.textContent = timeframe;
        timeframeSelect.appendChild(option);
    });
    
   
    if (timeframes.includes(currentValue)) {
        timeframeSelect.value = currentValue;
    }
}