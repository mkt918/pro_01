console.log('Algorithm Cards App Starting...');
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

// Constants
const CARD_COUNT = 13;

// Initialization
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
            const valJ = variables.j !== undefined ? variables.j : '';
            const valK = variables.k !== undefined ? variables.k : '';

            // Map 'i' to 'k' for display if k is not present
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
deck.generateSpades(CARD_COUNT);
deck.render(); // No argument needed as it targets #aaa-container internally logic update
renderCodeTemplate('linear');

// Event Listeners
document.getElementById('algo-select').addEventListener('change', (e) => {
    reset();
    renderCodeTemplate(e.target.value);
    // Update basic visibility without reset if possible? No, reset ensures clean state.
    // Actually, visibility is toggled inside initAlgorithm or reset?
    // Let's call reset which calls initAlgorithm logic or at least UI update?
    // reset() currently doesn't hide/show inputs. 
    // Let's move visibility toggle to a UI update function.
    updateUIControls();
});

document.getElementById('target-value').addEventListener('change', () => {
});

document.getElementById('skin-select').addEventListener('change', (e) => {
    deck.setSkin(e.target.value);
});

function updateUIControls() {
    const algoName = document.getElementById('algo-select').value;
    const targetInputContainer = document.getElementById('target-input-container');
    if (algoName === 'linear' || algoName === 'binary') {
        targetInputContainer.classList.remove('hidden');
    } else {
        targetInputContainer.classList.add('hidden');
    }
}

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

function initAlgorithm() {
    const algoName = document.getElementById('algo-select').value;
    const targetInputContainer = document.getElementById('target-input-container');
    const targetInput = document.getElementById('target-value');

    // Toggle Target Input Visibility
    if (algoName === 'linear' || algoName === 'binary') {
        targetInputContainer.classList.remove('hidden');
    } else {
        targetInputContainer.classList.add('hidden');
    }

    // Binary Search requires sorted array
    if (algoName === 'binary') {
        // Sort only 1..N
        const sub = deck.cards.slice(1);
        sub.sort((a, b) => a.value - b.value);
        deck.cards = [null, ...sub];
        deck.render();
    }

    switch (algoName) {
        case 'linear':
            {
                // User input or defaults
                let val = parseInt(targetInput.value);
                if (isNaN(val) || val < 1 || val > 13) val = Math.floor(Math.random() * CARD_COUNT) + 1;
                targetInput.value = val; // Update UI if corrected

                // Create Target Card Visual
                deck.setSlots({ target: deck.createCard('spades', val, 999) });

                visualizer.setAlgorithm(linearSearch, val);
            }
            break;
        case 'binary':
            {
                // User input or defaults
                let val = parseInt(targetInput.value);
                if (isNaN(val) || val < 1 || val > 13) val = Math.floor(Math.random() * CARD_COUNT) + 1;
                targetInput.value = val;

                // Create Target Card Visual
                deck.setSlots({ target: deck.createCard('spades', val, 999) });

                // Ensure valid cards exist? Binary search can search for missing values too!
                // So we don't strictly need the value to exist in the deck.

                visualizer.setAlgorithm(binarySearch, val);
            }
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
    console.log('Resetting application state...');
    visualizer.reset();
    deck.generateSpades(CARD_COUNT);

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

    updateUIControls();
    // Also clear Target slot
    deck.setSlots({ target: null });
}

function renderCodeTemplate(algoName) {
    const lines = codeTemplates[algoName] || ["コードがありません"];
    codeView.innerHTML = lines.map(line => `<div class="code-line">${line}</div>`).join('');
}

// Initial reset
reset();
