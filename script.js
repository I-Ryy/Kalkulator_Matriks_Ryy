// Global variables
let currentTheme = 'light';

// Theme toggle functionality
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('theme-icon').textContent = currentTheme === 'light' ? 'Mode Gelap' : 'Mode Terang';
}

// Matrix creation and manipulation functions
function createMatrix(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    const container = document.getElementById(`matrix${matrixName}`);
    
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.id = `${matrixName}_${i}_${j}`;
            input.value = '0';
            input.step = '0.01';
            input.placeholder = `${i+1},${j+1}`;
            container.appendChild(input);
        }
    }
}

function getMatrix(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    const matrix = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`${matrixName}_${i}_${j}`).value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

function fillRandom(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const randomValue = Math.floor(Math.random() * 20) - 10;
            document.getElementById(`${matrixName}_${i}_${j}`).value = randomValue;
        }
    }
    
    // Add animation effect
    const container = document.getElementById(`matrix${matrixName}`);
    container.classList.add('fade-in');
    setTimeout(() => container.classList.remove('fade-in'), 500);
}

function fillIdentity(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(`${matrixName}_${i}_${j}`).value = (i === j) ? 1 : 0;
        }
    }
    
    // Add animation effect
    const container = document.getElementById(`matrix${matrixName}`);
    container.classList.add('pulse');
    setTimeout(() => container.classList.remove('pulse'), 1000);
}

function clearMatrix(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(`${matrixName}_${i}_${j}`).value = '0';
        }
    }
}

// Matrix display function
function displayMatrix(matrix, title = '') {
    let html = '<div class="matrix-display">';
    if (title) html += `<h3>${title}</h3>`;
    
    html += '<div style="display: flex; align-items: center; justify-content: center;">';
    html += '<span class="matrix-bracket">[</span>';
    html += '<table>';
    
    for (let i = 0; i < matrix.length; i++) {
        html += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            const value = Number(matrix[i][j]);
            const displayValue = Math.abs(value) < 1e-10 ? '0.00' : value.toFixed(2);
            html += `<td>${displayValue}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</table>';
    html += '<span class="matrix-bracket">]</span>';
    html += '</div></div>';
    
    return html;
}

// Matrix operation functions
function addMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Matriks harus memiliki ukuran yang sama untuk penjumlahan');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < a[i].length; j++) {
            row.push(a[i][j] + b[i][j]);
        }
        result.push(row);
    }
    return result;
}

function subtractMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Matriks harus memiliki ukuran yang sama untuk pengurangan');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < a[i].length; j++) {
            row.push(a[i][j] - b[i][j]);
        }
        result.push(row);
    }
    return result;
}

function multiplyMatrices(a, b) {
    if (a[0].length !== b.length) {
        throw new Error('Jumlah kolom matriks A harus sama dengan jumlah baris matriks B');
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < b.length; k++) {
                sum += a[i][k] * b[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }
    return result;
}

function transposeMatrix(matrix) {
    const result = [];
    for (let j = 0; j < matrix[0].length; j++) {
        const row = [];
        for (let i = 0; i < matrix.length; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    return result;
}

function determinant(matrix) {
    const n = matrix.length;
    if (n !== matrix[0].length) {
        throw new Error('Determinan hanya dapat dihitung untuk matriks persegi');
    }
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
        const minor = getMinor(matrix, 0, j);
        det += Math.pow(-1, j) * matrix[0][j] * determinant(minor);
    }
    return det;
}

function getMinor(matrix, row, col) {
    const minor = [];
    for (let i = 0; i < matrix.length; i++) {
        if (i === row) continue;
        const minorRow = [];
        for (let j = 0; j < matrix[i].length; j++) {
            if (j === col) continue;
            minorRow.push(matrix[i][j]);
        }
        minor.push(minorRow);
    }
    return minor;
}

function inverseMatrix(matrix) {
    const n = matrix.length;
    if (n !== matrix[0].length) {
        throw new Error('Invers hanya dapat dihitung untuk matriks persegi');
    }
    
    const det = determinant(matrix);
    if (Math.abs(det) < 1e-10) {
        throw new Error('Matriks singular, tidak memiliki invers (determinan = 0)');
    }
    
    if (n === 1) return [[1 / matrix[0][0]]];
    
    if (n === 2) {
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    }
    
    const adj = adjugateMatrix(matrix);
    const result = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(adj[i][j] / det);
        }
        result.push(row);
    }
    return result;
}

function adjugateMatrix(matrix) {
    const n = matrix.length;
    const adj = [];
    
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            const minor = getMinor(matrix, i, j);
            const cofactor = Math.pow(-1, i + j) * determinant(minor);
            row.push(cofactor);
        }
        adj.push(row);
    }
    
    return transposeMatrix(adj);
}

function matrixPower(matrix, power) {
    if (matrix.length !== matrix[0].length) {
        throw new Error('Pangkat matriks hanya dapat dihitung untuk matriks persegi');
    }
    
    if (power < 0) {
        throw new Error('Pangkat negatif tidak didukung');
    }
    
    if (power === 0) {
        const n = matrix.length;
        const identity = [];
        for (let i = 0; i < n; i++) {
            const row = [];
            for (let j = 0; j < n; j++) {
                row.push(i === j ? 1 : 0);
            }
            identity.push(row);
        }
        return identity;
    }
    
    if (power === 1) return matrix;
    
    let result = matrix;
    for (let i = 1; i < power; i++) {
        result = multiplyMatrices(result, matrix);
    }
    return result;
}

// Main operation handler
function performOperation(operation) {
    const resultDiv = document.getElementById('result');
    
    // Show loading
    resultDiv.innerHTML = '<div class="loading"></div><p>Menghitung...</p>';
    
    setTimeout(() => {
        try {
            const matrixA = getMatrix('A');
            const matrixB = getMatrix('B');
            let result, title;
            
            switch (operation) {
                case 'add':
                    result = addMatrices(matrixA, matrixB);
                    title = 'A + B =';
                    break;
                case 'subtract':
                    result = subtractMatrices(matrixA, matrixB);
                    title = 'A - B =';
                    break;
                case 'multiply':
                    result = multiplyMatrices(matrixA, matrixB);
                    title = 'A × B =';
                    break;
                case 'transposeA':
                    result = transposeMatrix(matrixA);
                    title = 'Transpose A =';
                    break;
                case 'transposeB':
                    result = transposeMatrix(matrixB);
                    title = 'Transpose B =';
                    break;
                case 'determinantA':
                    const detA = determinant(matrixA);
                    resultDiv.innerHTML = `<div class="success"><h3>Determinan A = ${detA.toFixed(6)}</h3><p>Matriks ${matrixA.length}×${matrixA[0].length}</p></div>`;
                    return;
                case 'determinantB':
                    const detB = determinant(matrixB);
                    resultDiv.innerHTML = `<div class="success"><h3>Determinan B = ${detB.toFixed(6)}</h3><p>Matriks ${matrixB
