import './style.css'
import { Deck } from './Deck.js';
import { Visualizer } from './Visualizer.js';
import { linearSearch } from './algorithms/linearSearch.js';
import { binarySearch } from './algorithms/binarySearch.js';
import { findMinMax } from './algorithms/minMax.js';
import { bubbleSort } from './algorithms/bubbleSort.js';
import { selectionSort } from './algorithms/selectionSort.js';
import { insertionSort } from './algorithms/insertionSort.js';
import { codeTemplates } from './codeTemplates.js';

// Initialization
const stage = document.getElementById('stage');
const deck = new Deck();

// UI Elements
const msgText = document.getElementById('msg-text');
const varMonitor = document.getElementById('variable-monitor');
const codeView = document.getElementById('code-view');

// Visualizer Setup
const visualizer = new Visualizer(deck, {
    onUpdate: ({ message, variables, codeLine }) => {
        if (message) msgText.textContent = message;
        if (variables) {
            varMonitor.textContent = Object.entries(variables)
                .map(([k, v]) => `${k} = ${v}`)
                .join(', ');

            // Update Visual Variable Boxes
            // Rules: i = counter, j, k = indices

            const valJ = variables.j !== undefined ? variables.j : '';
            const valK = variables.k !== undefined ? variables.k : '';

            // If algorithm uses 'i' as index (old style), we map it to 'k' for display if k is empty?
            // User wants strict: i for count, j/k for index.
            // My algorithms currently use 'i' as index in loop `for (let i=...)`.
            // So I will likely refactor algorithms to use `k` loop or keep `i` loop but display it as `k`?
            // Better: Refactor algorithms to use `k` for index operations where visually relevant.

            // For now, map 'i' to 'k' if k is not present, assuming 'i' is providing the index context.
            // But ideally we rewrite algorithms. 
            // Let's implement the mapping here temporarily.
            const displayK = valK !== '' ? valK : (variables.i !== undefined ? variables.i : '');

            const elJ = document.getElementById('var-j');
            const elK = document.getElementById('var-k');

            if (elJ) elJ.textContent = valJ;
            if (elK) elK.textContent = displayK;
        }

        // Highlight Code Line
        if (codeLine) {
            const lines = codeView.querySelectorAll('.code-line');
            lines.forEach(el => el.classList.remove('active'));
            if (lines[codeLine - 1]) {
                lines[codeLine - 1].classList.add('active');
                lines[codeLine - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    },
    onFinished: () => {
        msgText.textContent += " (完了)";
    }
});

const btnManual = document.getElementById('btn-manual-mode');
let isManualMode = false;

btnManual.addEventListener('click', () => {
    isManualMode = !isManualMode;
    if (isManualMode) {
        btnManual.textContent = "手動モード終了 (Exit Manual)";
        btnManual.style.background = "var(--accent-color)";
        deck.enableManualMode();
        // Disable alg controls
        document.getElementById('btn-play-pause').disabled = true;
        document.getElementById('btn-step-fwd').disabled = true;
        document.getElementById('btn-step-back').disabled = true;
        document.getElementById('algo-select').disabled = true;
        visualizer.reset(); // Clear visualizer state to avoid conflict
    } else {
        btnManual.textContent = "手動モード (Manual)";
        btnManual.style.background = ""; // Revert to default/CSS
        deck.disableManualMode();
        // Enable alg controls
        document.getElementById('btn-play-pause').disabled = false;
        document.getElementById('btn-step-fwd').disabled = false;
        document.getElementById('btn-step-back').disabled = false;
        document.getElementById('algo-select').disabled = false;
    }
});

// Initial Render
deck.generateSpades(13);
deck.render(); // No argument needed as it targets #aaa-container internally logic update
renderCodeTemplate('linear');

// Event Listeners
document.getElementById('algo-select').addEventListener('change', (e) => {
    reset();
    renderCodeTemplate(e.target.value);
});

document.getElementById('btn-reset').addEventListener('click', () => {
    reset();
});

document.getElementById('btn-step-fwd').addEventListener('click', () => {
    if (visualizer.currentStepIndex === -1) {
        initAlgorithm();
    }
    visualizer.stepForward();
});

document.getElementById('btn-step-back').addEventListener('click', () => {
    visualizer.stepBack();
});

document.getElementById('btn-play-pause').addEventListener('click', () => {
    if (visualizer.currentStepIndex === -1) {
        initAlgorithm();
    }

    if (visualizer.isPlaying) {
        visualizer.pause();
    } else {
        visualizer.play();
    }
});

const speedRange = document.getElementById('speed-range');
speedRange.addEventListener('input', (e) => {
    visualizer.setSpeed(parseInt(e.target.value));
});

function initAlgorithm() {
    const algoName = document.getElementById('algo-select').value;

    // Safety check for Binary Search: Ensure sorted
    // Safety check for Binary Search: Ensure sorted (ignoring index 0 null)
    if (algoName === 'binary') {
        // Sort only 1..N
        const sub = deck.cards.slice(1);
        sub.sort((a, b) => a.value - b.value);
        deck.cards = [null, ...sub];
        deck.render();
    }

    switch (algoName) {
        case 'linear':
            const targetL = Math.floor(Math.random() * 13) + 1;
            visualizer.setAlgorithm(linearSearch, targetL);
            break;
        case 'binary':
            // Pick a random existing card (ignoring index 0 null)
            const validCards = deck.cards.filter(c => c !== null);
            const targetB = validCards[Math.floor(Math.random() * validCards.length)].value;
            visualizer.setAlgorithm(binarySearch, targetB);
            break;
        case 'minmax':
            visualizer.setAlgorithm(findMinMax);
            break;
        case 'bubble':
            visualizer.setAlgorithm(bubbleSort);
            break;
        case 'selection':
            visualizer.setAlgorithm(selectionSort);
            break;
        case 'insertion':
            visualizer.setAlgorithm(insertionSort);
            break;
    }
}

function reset() {
    visualizer.reset();
    deck.generateSpades(13);

    const algoName = document.getElementById('algo-select').value;
    if (algoName === 'binary') {
        deck.cards.sort((a, b) => {
            if (!a || !b) return 0;
            return a.value - b.value;
        });
    }

    deck.render();
    msgText.textContent = "リセットしました。";
    varMonitor.textContent = "";

    const lines = codeView.querySelectorAll('.code-line');
    lines.forEach(el => el.classList.remove('active'));
}

function renderCodeTemplate(algoName) {
    const lines = codeTemplates[algoName] || ["コードがありません"];
    codeView.innerHTML = lines.map(line => `<div class="code-line">${line}</div>`).join('');
}

// Initial reset
reset();
