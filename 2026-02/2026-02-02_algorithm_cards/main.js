console.log('Algorithm Cards App Starting...');

// Tutorial Control
const TUTORIAL_KEY = 'algorithm-tutorial-shown';

function shouldShowTutorial() {
    return !localStorage.getItem(TUTORIAL_KEY);
}

function markTutorialAsShown() {
    localStorage.setItem(TUTORIAL_KEY, 'true');
}

function showTutorialModal() {
    const modal = document.getElementById('tutorial-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideTutorialModal() {
    const modal = document.getElementById('tutorial-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

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

// --- Constants ---
const DEFAULT_CARD_COUNT = 13;
const FIRST_CARD_INDEX = 1; // logical start for algorithms that skip dummy
const DEFAULT_TARGET_VALUE = 2;

/**
 * アルゴリズムごとのコンテナ表示フラグ
 * @type {Object.<string, string[]>}
 */
const CONTAINER_VISIBILITY = {
    manual: ['hozon', 'found', 'target', 'max', 'min'],
    linear: ['found', 'target'],
    binary: ['found', 'target'],
    minmax: ['max', 'min'],
    bubble: [],
    selection: [],
    insertion: ['hozon']
};

/**
 * アプリケーションのグローバル状態管理オブジェクト
 */
const AppState = {
    isManualMode: true,
    currentLanguage: 'macro', // 'macro' or 'python'
    cardCount: DEFAULT_CARD_COUNT,
    targetValue: DEFAULT_TARGET_VALUE,
    deck: new Deck(),
    visualizer: null // initialized later
};

// UI Elements
const msgText = document.getElementById('msg-text');
const varMonitor = document.getElementById('variable-monitor');
const codeView = document.getElementById('code-view');

// Visualizer Setup
AppState.visualizer = new Visualizer(AppState.deck, {
    onUpdate: ({ message, variables, codeLine }) => {
        if (message) msgText.textContent = message;
        if (variables) {
            varMonitor.textContent = Object.entries(variables)
                .map(([k, v]) => `${k} = ${v}`)
                .join(', ');

            // Update Visual Variable Boxes
            const valJ = variables.j !== undefined ? variables.j : '';
            const valK = variables.k !== undefined ? variables.k : '';
            const valI = variables.i !== undefined ? variables.i : '';

            const elJ = document.getElementById('var-j');
            const elK = document.getElementById('var-k');
            const elI = document.getElementById('var-i');

            if (elJ) elJ.textContent = valJ;
            if (elK) elK.textContent = valK;
            if (elI) elI.textContent = valI;
        }
    },
    onFinished: () => {
        msgText.textContent += " (完了)";
    },
    highlightCode: (stepId, type) => {
        const lines = codeView.querySelectorAll('.code-line');
        if (stepId !== undefined && stepId !== null) {
            lines.forEach(el => {
                el.classList.remove('active', 'compare', 'swap');
                if (el.dataset.step == stepId) {
                    el.classList.add('active');
                    if (type === 'compare') {
                        el.classList.add('compare');
                    } else if (type === 'swap') {
                        el.classList.add('swap');
                    }
                }
            });
            const activeLine = codeView.querySelector('.code-line.active');
            if (activeLine) {
                activeLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            lines.forEach(el => {
                el.classList.remove('active', 'compare', 'swap');
            });
        }
    }
});

// Initial Render
AppState.deck.generateSpades(AppState.cardCount);
AppState.deck.render();
renderCodeTemplate('linear');

// Event Listeners
// アルゴリズム選択時のイベント
document.getElementById('algo-select').addEventListener('change', (e) => {
    const selected = e.target.value;

    // アルゴリズムの状態をリセット
    AppState.visualizer.reset();

    // モード（手動 vs 自動）に応じてUIを切り替え
    if (selected === 'manual') {
        enableManualModeUI();
    } else {
        if (selected === 'binary') {
            document.getElementById('target-value').value = 2; // 二分探索の初期値
        }
        disableManualModeUI();
        renderCodeTemplate(selected);
        reset();
    }

    updateContainerVisibility(selected);
    updateUIControls();
});

/**
 * 手動モードのUIを有効にします。
 * ドラッグ＆ドロップを許可し、自動実行ボタンを無効化します。
 */
function enableManualModeUI() {
    AppState.isManualMode = true;
    AppState.deck.enableManualMode();

    // Disable alg controls EXCEPT Undo (Back)
    document.getElementById('btn-play-pause').disabled = true;
    document.getElementById('btn-step-fwd').disabled = true;

    // Enable Undo button
    const btnBack = document.getElementById('btn-step-back');
    btnBack.disabled = false;
    btnBack.textContent = "元に戻す (Undo)";

    // Show manual instructions
    renderCodeTemplate('manual');
}

/**
 * 自動モード（アルゴリズム実行モード）のUIを有効にします。
 */
function disableManualModeUI() {
    AppState.isManualMode = false;
    AppState.deck.disableManualMode();

    // Enable alg controls
    document.getElementById('btn-play-pause').disabled = false;
    document.getElementById('btn-step-fwd').disabled = false;

    const btnBack = document.getElementById('btn-step-back');
    btnBack.disabled = false;
    btnBack.textContent = "戻る (Back)";
}

document.getElementById('target-value').addEventListener('change', () => {
});

document.getElementById('skin-select').addEventListener('change', (e) => {
    AppState.deck.setSkin(e.target.value);
});

/**
 * アルゴリズムの選択状態に合わせて、UIコントロール（ターゲット入力など）の表示を更新します。
 */
function updateUIControls() {
    const algoName = document.getElementById('algo-select').value;
    const targetInputContainer = document.getElementById('target-input-container');
    if (algoName === 'linear' || algoName === 'binary') {
        targetInputContainer.classList.remove('hidden');
    } else {
        targetInputContainer.classList.add('hidden');
    }
}

/**
 * 指定したアルゴリズムに必要なコンテナ（hozon, max, min等）のみを表示し、不要なものを隠します。
 * @param {string} algoName - アルゴリズム名
 */
function updateContainerVisibility(algoName) {
    const containers = ['hozon', 'found', 'target', 'max', 'min'];
    const visibleContainers = CONTAINER_VISIBILITY[algoName] || [];

    containers.forEach(name => {
        const container = document.querySelector(`.${name}-container`);
        if (container) {
            if (visibleContainers.includes(name)) {
                container.classList.remove('hidden');
            } else {
                container.classList.add('hidden');
            }
        }
    });
}

document.getElementById('btn-reset').addEventListener('click', () => {
    reset();
});

document.getElementById('btn-step-fwd').addEventListener('click', () => {
    if (AppState.visualizer.currentStepIndex === -1) {
        initAlgorithm();
    }
    AppState.visualizer.stepForward();
});

document.getElementById('btn-step-back').addEventListener('click', () => {
    if (AppState.isManualMode) {
        AppState.deck.undoManualState();
    } else {
        AppState.visualizer.stepBack();
    }
});

document.getElementById('btn-play-pause').addEventListener('click', () => {
    if (AppState.visualizer.currentStepIndex === -1) {
        initAlgorithm();
    }

    if (AppState.visualizer.isPlaying) {
        AppState.visualizer.pause();
    } else {
        AppState.visualizer.play();
    }
});

/**
 * 選択されたアルゴリズムを初期化し、実行準備を行います。
 */
function initAlgorithm() {
    try {
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
            const sub = AppState.deck.cards.slice(FIRST_CARD_INDEX);
            sub.sort((a, b) => a.value - b.value);
            AppState.deck.cards = [null, ...sub];
            AppState.deck.render();
        }

        switch (algoName) {
            case 'linear':
                {
                    let val = parseInt(targetInput.value);
                    if (isNaN(val) || val < 1 || val > 13) val = Math.floor(Math.random() * AppState.cardCount) + 1;
                    targetInput.value = val;
                    AppState.targetValue = val;

                    AppState.deck.setSlots({ target: AppState.deck.createCard('spades', val, 999) });
                    AppState.visualizer.setAlgorithm(linearSearch, val);
                }
                break;
            case 'binary':
                {
                    let val = parseInt(targetInput.value);
                    if (isNaN(val) || val < 1 || val > 13) val = Math.floor(Math.random() * AppState.cardCount) + 1;
                    targetInput.value = val;
                    AppState.targetValue = val;

                    AppState.deck.setSlots({ target: AppState.deck.createCard('spades', val, 999) });
                    AppState.visualizer.setAlgorithm(binarySearch, val);
                }
                break;
            case 'minmax':
                AppState.visualizer.setAlgorithm(findMinMax);
                break;
            case 'bubble':
                AppState.visualizer.setAlgorithm(bubbleSort);
                break;
            case 'selection':
                AppState.visualizer.setAlgorithm(selectionSort);
                break;
            case 'insertion':
                AppState.visualizer.setAlgorithm(insertionSort);
                break;
        }
    } catch (error) {
        console.error('Algorithm initialization failed:', error);
        msgText.textContent = "エラーが発生しました: " + error.message;
    }
}

/**
 * アプリケーションを初期状態にリセットします。
 */
function reset() {
    console.log('Resetting application state...');
    AppState.visualizer.reset();
    AppState.deck.generateSpades(AppState.cardCount);

    const algoName = document.getElementById('algo-select').value;
    if (algoName === 'binary') {
        const sub = AppState.deck.cards.slice(FIRST_CARD_INDEX);
        sub.sort((a, b) => a.value - b.value);
        AppState.deck.cards = [null, ...sub];
    }

    AppState.deck.render();
    msgText.textContent = "リセットしました。";
    varMonitor.textContent = "";

    const lines = codeView.querySelectorAll('.code-line');
    lines.forEach(el => el.classList.remove('active', 'compare', 'swap'));

    updateContainerVisibility(algoName);
    updateUIControls();
    AppState.deck.setSlots({ target: null });
}


/**
 * 指定したアルゴリズムのコードテンプレートを指定言語で描画します。
 * @param {string} algoName - アルゴリズム名
 */
function renderCodeTemplate(algoName) {
    const templates = codeTemplates[algoName];
    if (!templates) {
        codeView.innerHTML = '<div class="code-line">コードがありません</div>';
        return;
    }
    const lines = templates[AppState.currentLanguage] || templates['macro'] || ["コードがありません"];
    codeView.innerHTML = lines.map(line => {
        const text = typeof line === 'string' ? line : line.text;
        const step = (line.step !== undefined && line.step !== null) ? ` data-step="${line.step}"` : '';
        return `<div class="code-line underline-offset-4"${step}>${text}</div>`;
    }).join('');
}

// Tab Switching
const tabMacro = document.getElementById('tab-macro');
const tabPython = document.getElementById('tab-python');

/**
 * タブのUI表示（アクティブ状態）を選択中の言語に合わせて更新します。
 */
function updateTabsUI() {
    if (AppState.currentLanguage === 'macro') {
        tabMacro.className = "flex-1 rounded-t-lg font-bold transition-all bg-primary text-white shadow-lg border-b-2 border-primary";
        tabPython.className = "flex-1 rounded-t-lg font-bold transition-all bg-white/5 text-white/50 hover:bg-white/10 shadow-lg border-b-2 border-transparent";
    } else {
        tabPython.className = "flex-1 rounded-t-lg font-bold transition-all bg-primary text-white shadow-lg border-b-2 border-primary";
        tabMacro.className = "flex-1 rounded-t-lg font-bold transition-all bg-white/5 text-white/50 hover:bg-white/10 shadow-lg border-b-2 border-transparent";
    }
}

/**
 * 表示言語を切り替え、UIとコード表示を更新します。
 * @param {string} lang - 切り替え後の言語 ('macro' | 'python')
 */
function changeLanguage(lang) {
    AppState.currentLanguage = lang;
    updateTabsUI();
    const algoName = document.getElementById('algo-select').value;
    renderCodeTemplate(algoName);
    rehighlightCurrentStep();
}

/**
 * 現在の実行ステップをコードビュー上で再強調表示します（言語切り替え時などに使用）。
 */
function rehighlightCurrentStep() {
    if (AppState.visualizer.currentStepIndex >= 0) {
        const step = AppState.visualizer.steps[AppState.visualizer.currentStepIndex];
        if (step && step.codeLine !== undefined) {
            AppState.visualizer.highlightCode(step.codeLine, step.type);
        }
    }
}

tabMacro.addEventListener('click', () => changeLanguage('macro'));
tabPython.addEventListener('click', () => changeLanguage('python'));

// Initialize Deck
AppState.deck.generateSpades(AppState.cardCount);
AppState.deck.render();

// Enable Manual UI
enableManualModeUI();

// Render Initial Template
renderCodeTemplate('manual');

// Initialize Container Visibility
updateContainerVisibility('manual');

// Tutorial Modal Event Listeners
const closeTutorialBtn = document.getElementById('close-tutorial');
const startLearningBtn = document.getElementById('start-learning');
const dontShowAgainCheckbox = document.getElementById('dont-show-again');

if (closeTutorialBtn) {
    closeTutorialBtn.addEventListener('click', () => {
        hideTutorialModal();
    });
}

if (startLearningBtn) {
    startLearningBtn.addEventListener('click', () => {
        if (dontShowAgainCheckbox && dontShowAgainCheckbox.checked) {
            markTutorialAsShown();
        }
        hideTutorialModal();
    });
}

// Show tutorial on first visit
if (shouldShowTutorial()) {
    // Delay slightly to ensure DOM is fully loaded
    setTimeout(() => {
        showTutorialModal();
    }, 500);
}
