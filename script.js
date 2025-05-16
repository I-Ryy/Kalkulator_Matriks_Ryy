function generateMatrix() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
  
    const matrixA = document.getElementById('matrixA');
    const matrixB = document.getElementById('matrixB');
  
    matrixA.innerHTML = '<h2>Matriks A</h2>';
    matrixB.innerHTML = '<h2>Matriks B</h2>';
  
    const gridA = document.createElement('div');
    gridA.className = 'matrix';
    gridA.style.gridTemplateColumns = `repeat(${colsA}, 1fr)`;
    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsA; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `A-${i}-${j}`;
        gridA.appendChild(input);
      }
    }
  
    const gridB = document.createElement('div');
    gridB.className = 'matrix';
    gridB.style.gridTemplateColumns = `repeat(${colsB}, 1fr)`;
    for (let i = 0; i < rowsB; i++) {
      for (let j = 0; j < colsB; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `B-${i}-${j}`;
        gridB.appendChild(input);
      }
    }
  
    matrixA.appendChild(gridA);
    matrixB.appendChild(gridB);
  }
  
  function getMatrix(name) {
    const rows = parseInt(document.getElementById(`rows${name}`).value);
    const cols = parseInt(document.getElementById(`cols${name}`).value);
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const value = parseFloat(document.getElementById(`${name}-${i}-${j}`).value) || 0;
        row.push(value);
      }
      matrix.push(row);
    }
    return matrix;
  }
  
  function displayResult(matrix) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Hasil:</h2>';
    const table = document.createElement('div');
    table.className = 'matrix';
    table.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
    matrix.forEach(row => {
      row.forEach(value => {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.disabled = true;
        cell.value = Math.round(value * 1000) / 1000;
        table.appendChild(cell);
      });
    });
    resultDiv.appendChild(table);
  }
  
  function addMatrices() {
    const A = getMatrix('A');
    const B = getMatrix('B');
    if (A.length !== B.length || A[0].length !== B[0].length) {
      alert('Dimensi matriks harus sama!');
      return;
    }
    const result = A.map((row, i) => row.map((val, j) => val + B[i][j]));
    displayResult(result);
  }
  
  function subtractMatrices() {
    const A = getMatrix('A');
    const B = getMatrix('B');
    if (A.length !== B.length || A[0].length !== B[0].length) {
      alert('Dimensi matriks harus sama!');
      return;
    }
    const result = A.map((row, i) => row.map((val, j) => val - B[i][j]));
    displayResult(result);
  }
  
  function multiplyMatrices() {
    const A = getMatrix('A');
    const B = getMatrix('B');
    if (A[0].length !== B.length) {
      alert('Jumlah kolom A harus sama dengan jumlah baris B untuk perkalian!');
      return;
    }
    const result = Array.from({ length: A.length }, () => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        for (let k = 0; k < A[0].length; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    displayResult(result);
  }
  
  function scalarMultiplyMatrix(matrixName) {
    const scalar = parseFloat(prompt('Masukkan skalar:'));
    if (isNaN(scalar)) {
      alert('Input skalar tidak valid!');
      return;
    }
    const M = getMatrix(matrixName);
    const result = M.map(row => row.map(val => val * scalar));
    displayResult(result);
  }
  
  function transposeMatrix(matrixName) {
    const M = getMatrix(matrixName);
    const result = M[0].map((_, i) => M.map(row => row[i]));
    displayResult(result);
  }
  
  function determinantMatrix(matrixName) {
    const M = getMatrix(matrixName);
    if (M.length !== M[0].length) {
      alert('Matriks harus persegi untuk determinan!');
      return;
    }
    const det = determinant(M);
    document.getElementById('result').innerHTML = `<h2>Determinan: ${Math.round(det * 1000) / 1000}</h2>`;
  }
  
  function determinant(M) {
    if (M.length === 1) return M[0][0];
    if (M.length === 2) return M[0][0]*M[1][1] - M[0][1]*M[1][0];
  
    let det = 0;
    for (let i = 0; i < M.length; i++) {
      const subMatrix = M.slice(1).map(row => row.filter((_, j) => j !== i));
      det += (i % 2 === 0 ? 1 : -1) * M[0][i] * determinant(subMatrix);
    }
    return det;
  }
  
  function inverseMatrix(matrixName) {
    const M = getMatrix(matrixName);
    const det = determinant(M);
    if (M.length !== M[0].length) {
      alert('Matriks harus persegi untuk invers!');
      return;
    }
    if (det === 0) {
      alert('Matriks tidak memiliki invers!');
      return;
    }
    const n = M.length;
    const adj = [];
    for (let i = 0; i < n; i++) {
      adj[i] = [];
      for (let j = 0; j < n; j++) {
        const minor = M.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j));
        adj[i][j] = ((i+j) % 2 === 0 ? 1 : -1) * determinant(minor);
      }
    }
    const adjT = adj[0].map((_, i) => adj.map(row => row[i]));
    const inv = adjT.map(row => row.map(val => val / det));
    displayResult(inv);
  }
  
  function resetAll() {
    document.getElementById('matrixA').innerHTML = '';
    document.getElementById('matrixB').innerHTML = '';
    document.getElementById('result').innerHTML = '';
  }
  