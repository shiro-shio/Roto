let currentLottoNumbers = [];
let currentCount = 0;
let lottoHistory = [];
let maxNumbers;
let numberRange;

document.getElementById('drawButton').addEventListener('click', function() {
    maxNumbers = parseInt(document.getElementById('maxNumbers').value);
    numberRange = parseInt(document.getElementById('numberRange').value);
    
    // 如果是新的一輪開始，重新生成數字並重置計數器
    if (currentCount === 0) {
        currentLottoNumbers = generateLottoNumbers(maxNumbers, numberRange);
        lottoHistory.push(currentLottoNumbers.slice()); // 深拷貝數字到歷史記錄
    }
    
    if (currentCount < maxNumbers) {
        displayNextNumber();
        currentCount++;
    } else {
        // 當前輪數字已全部顯示，準備下一輪
        currentCount = 0;
        updateHistory();
    }
});

document.getElementById('clearHistory').addEventListener('click', function() {
    lottoHistory = [];
    updateHistory();
    document.getElementById('results').innerHTML = '';
    // 重置準備下一輪
    currentCount = 0;
});

function generateLottoNumbers(maxNumbers, numberRange) {
    let numbers = [];
    while (numbers.length < maxNumbers) {
        let number = Math.floor(Math.random() * numberRange) + 1;
        if (!numbers.includes(number)) {
            numbers.push(number);
        }
    }
    numbers.sort((a, b) => a - b);
    return numbers;
}

function displayNextNumber() {
    let displayElement = document.getElementById('results');
    let numbersHtml = '本輪已抽取號碼：';
    for (let i = 0; i <= currentCount; i++) {
        numbersHtml += `<span class="lotto-number">${currentLottoNumbers[i]}</span> `;
    }
    displayElement.innerHTML = numbersHtml;
}

function updateHistory() {
    let historyElement = document.getElementById('history');
    let maxMysteryNumbers = parseInt(document.getElementById('maxMysteryNumbers').value);
    let tableHtml = '<table><thead><tr><th>輪次</th><th>開獎號碼</th><th>特別號</th></tr></thead><tbody>';

    lottoHistory.forEach(function(numbers, index) {
        let round = index + 1;
        let numbersHtml = numbers.map(number => `<span class="lotto-number">${number}</span>`).join(' ');
        let mysteryNumbersHtml = '';
        for (let i = 0; i < maxMysteryNumbers; i++) {
            let specialNumber = generateSpecialNumber(numbers);
            mysteryNumbersHtml += `<span class="mystery-number" onclick="revealSpecialNumber(this, ${specialNumber})">?</span><span class="special-number">${specialNumber}</span>`;
        }
        tableHtml += `<tr><td>第${round}輪</td><td>${numbersHtml}</td><td>${mysteryNumbersHtml}</td></tr>`;
    });

    tableHtml += '</tbody></table>';
    historyElement.innerHTML = tableHtml;
}

function generateSpecialNumber(existingNumbers) {
    let specialNumber;
    do {
        specialNumber = Math.floor(Math.random() * numberRange) + 1;
    } while (existingNumbers.includes(specialNumber));
    return specialNumber;
}

function revealSpecialNumber(element, number) {
    element.style.display = 'none'; // 隱藏問號
    // 創建新的span元素來顯示特別號碼
    let specialNumberSpan = document.createElement('span');
    specialNumberSpan.className = 'special-lotto-number'; // 使用新的樣式類別
    specialNumberSpan.textContent = number;
    element.parentNode.insertBefore(specialNumberSpan, element.nextSibling);
}