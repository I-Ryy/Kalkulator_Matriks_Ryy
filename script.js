// Global variables
let theme = 'light';

// Theme functionality
function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('.theme-toggle').textContent = theme === 'light' ? '🌙' : '☀️';
}

// Matrix creation and management
function createMatrix(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    const container = document.getElementById(`matrix${matrixName}`);
    
    container.innerHTML = '';
    
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `${matrixName}_${i}_${j}`;
            input.value = '0';
            input.step = '0.1';
            row.appendChild(input);
        }
        
        container.appendChild(row);
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

function displayMatrix(matrix, title = '') {
    let html = title ? `<strong>${title}</strong>\n` : '';
    html += '<div class="matrix-display"><table>';
    
    for (let i = 0; i < matrix.length; i++) {
        html += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            const value = typeof matrix[i][j] === 'number' ? 
                (matrix[i][j] % 1 === 0 ? matrix[i][j] : matrix[i][j].toFixed(3)) : 
                matrix[i][j];
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</table></div>';
    return html;
}

// Matrix operations
function addMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Matriks harus memiliki dimensi yang sama untuk penjumlahan');
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
        throw new Error('Matriks harus memiliki dimensi yang sama untuk pengurangan');
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

function transpose(matrix) {
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
        throw new Error('Matriks harus persegi untuk menghitung determinan');
    }
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
        const minor = [];
        for (let i = 1; i < n; i++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                if (k !== j) row.push(matrix[i][k]);
            }
            minor.push(row);
        }
        det += Math.pow(-1, j) * matrix[0][j] * determinant(minor);
    }
    return det;
}

function inverse(matrix) {
    const n = matrix.length;
    if (n !== matrix[0].length) {
        throw new Error('Matriks harus persegi untuk menghitung invers');
    }
    
    const det = determinant(matrix);
    if (Math.abs(det) < 1e-10) {
        throw new Error('Matriks singular (determinan = 0), tidak memiliki invers');
    }
    
    if (n === 1) return [[1 / matrix[0][0]]];
    if (n === 2) {
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    }
    
    // Untuk matriks yang lebih besar, gunakan metode adjugate
    const adj = adjugate(matrix);
    return adj.map(row => row.map(val => val / det));
}

function adjugate(matrix) {
    const n = matrix.length;
    const adj = [];
    
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            const minor = [];
            for (let x = 0; x < n; x++) {
                if (x !== i) {
                    const minorRow = [];
                    for (let y = 0; y < n; y++) {
                        if (y !== j) minorRow.push(matrix[x][y]);
                    }
                    minor.push(minorRow);
                }
            }
            row.push(Math.pow(-1, i + j) * determinant(minor));
        }
        adj.push(row);
    }
    
    return transpose(adj);
}

// Main calculation function
function calculate(operation) {
    const resultDiv = document.getElementById('result');
    
    try {
        const matrixA = getMatrix('A');
        const matrixB = getMatrix('B');
        let result;
        let resultText = '';
        
        switch (operation) {
            case 'add':
                result = addMatrices(matrixA, matrixB);
                resultText = displayMatrix(result, 'A + B =');
                break;
            case 'subtract':
                result = subtractMatrices(matrixA, matrixB);
                resultText = displayMatrix(result, 'A - B =');
                break;
            case 'multiply':
                result = multiplyMatrices(matrixA, matrixB);
                resultText = displayMatrix(result, 'A × B =');
                break;
            case 'detA':
                result = determinant(matrixA);
                resultText = `<strong>Determinan A = ${result}</strong>`;
                break;
            case 'detB':
                result = determinant(matrixB);
                resultText = `<strong>Determinan B = ${result}</strong>`;
                break;
            case 'transposeA':
                result = transpose(matrixA);
                resultText = displayMatrix(result, 'A<sup>T</sup> =');
                break;
            case 'transposeB':
                result = transpose(matrixB);
                resultText = displayMatrix(result, 'B<sup>T</sup> =');
                break;
            case 'inverseA':
                result = inverse(matrixA);
                resultText = displayMatrix(result, 'A<sup>-1</sup> =');
                break;
            case 'inverseB':
                result = inverse(matrixB);
                resultText = displayMatrix(result, 'B<sup>-1</sup> =');
                break;
        }
        
        resultDiv.innerHTML = resultText;
        resultDiv.classList.add('fade-in');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            resultDiv.classList.remove('fade-in');
        }, 500);
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Utility functions
function fillRandom(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${matrixName}_${i}_${j}`);
            input.value = Math.floor(Math.random() * 20) - 10; // -10 to 9
        }
    }
}

function clearMatrix(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${matrixName}_${i}_${j}`);
            input.value = '0';
        }
    }
}

function clearResult() {
    document.getElementById('result').innerHTML = 'Pilih operasi untuk melihat hasil...';
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize matrices
    createMatrix('A');
    createMatrix('B');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', theme);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + T for theme toggle
    if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        toggleTheme();
    }
    
    // Ctrl/Cmd + R for random fill (focus on matrix A)
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        fillRandom('A');
        fillRandom('B');
    }
    
    // Escape to clear result
    if (event.key === 'Escape') {
        clearResult();
    }
});

// Input validation
document.addEventListener('input', function(event) {
    if (event.target.classList.contains('matrix-cell')) {
        const value = parseFloat(event.target.value);
        if (isNaN(value)) {
            event.target.style.borderColor = '#e53e3e';
        } else {
            event.target.style.borderColor = 'transparent';
        }
    }
});
