import { Card } from './Card.js';

export class Deck {
    constructor() {
        this.cards = [];
        this.bbb = new Array(14).fill(null); // bbb array (1-based, 0-13 empty)
        this.hozon = null; // hozon state
    }

    // Generate a random set of N cards
    generate(count = 5) {
        this.cards = [];
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];

        for (let i = 0; i < count; i++) {
            // Random value 1-13
            const value = Math.floor(Math.random() * 13) + 1;
            const suit = suits[Math.floor(Math.random() * suits.length)];
            // Simple ID generation
            this.cards.push(new Card(suit, value, i));
        }
        return this.cards;
    }

    // Generate Spades 1 to 13 (K) and shuffle, placed in 1-based array (index 0 empty)
    generateSpades(count = 13) {
        this.cards = [];
        this.cards.push(null); // Index 0 empty

        let tempCards = [];
        for (let i = 1; i <= count; i++) {
            tempCards.push(new Card('spades', i, i));
        }

        // Shuffle tempCards
        for (let i = tempCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tempCards[i], tempCards[j]] = [tempCards[j], tempCards[i]];
        }

        // Append to this.cards starting at index 1
        this.cards = this.cards.concat(tempCards);

        return this.cards;
    }

    // Pre-defined set for specific teaching scenarios
    setCards(values) {
        this.cards = values.map((v, i) => new Card('spades', v, i)); // Default to spades for simple number array
        return this.cards;
    }

    shuffle() {
        // Shuffle only indices 1 to length-1
        // But since I rebuilt generateSpades to handle shuffle internally for "clean" start,
        // let's update this generic shuffle to respect index 0 null.
        for (let i = this.cards.length - 1; i > 1; i--) {
            const j = Math.floor(Math.random() * (i)) + 1; // 1 to i
            // Oops, range should be 1 to i. random * i -> 0 to i-1. +1 -> 1 to i.
            // Correct.
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    render() {
        const aaaContainer = document.getElementById('aaa-container');
        if (!aaaContainer) return;

        aaaContainer.innerHTML = '';

        // Render aaa (1-based index 0-13) - Optimized with DocumentFragment
        const aaaFragment = document.createDocumentFragment();
        this.cards.forEach((card, index) => {
            const wrapper = this.createWrapper(card, index, 'aaa');
            aaaFragment.appendChild(wrapper);
        });
        aaaContainer.appendChild(aaaFragment);

        // Render bbb (1-based index 0-13) - Optimized with DocumentFragment
        const bbbContainer = document.getElementById('bbb-container');
        if (bbbContainer) {
            bbbContainer.innerHTML = '';
            const bbbFragment = document.createDocumentFragment();
            for (let i = 0; i < 14; i++) { // Fixed 14 size
                const card = this.bbb && this.bbb[i] ? this.bbb[i] : null;
                const wrapper = this.createWrapper(card, i, 'bbb');
                bbbFragment.appendChild(wrapper);
            }
            bbbContainer.appendChild(bbbFragment);
        }

        // Render Hozon
        const hozonSlot = document.getElementById('hozon-slot');
        if (hozonSlot) {
            hozonSlot.innerHTML = '';
            this.setupDropZone(hozonSlot, 0, 'hozon'); // 0 index dummy
            if (this.hozon) {
                const el = this.hozon.createDOMElement();
                if (this.hozon.isDraggable) el.draggable = true; // Ensure draggable reflected
                hozonSlot.appendChild(el);
            }
        }
    }

    createWrapper(card, index, type) {
        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';

        const idxLabel = document.createElement('div');
        idxLabel.className = 'index-label';
        idxLabel.textContent = index;
        wrapper.appendChild(idxLabel);

        // Drop Zone Logic
        this.setupDropZone(wrapper, index, type);

        if (card) {
            const cardEl = card.createDOMElement();
            wrapper.appendChild(cardEl);
        } else {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'card empty-slot';
            emptySlot.textContent = (type === 'aaa' && index === 0) ? "∅" : "";
            wrapper.appendChild(emptySlot);
        }
        return wrapper;
    }

    setupDropZone(element, index, type) {
        // Prevent default to allow drop
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            const cardId = parseInt(e.dataTransfer.getData('text/plain'), 10);
            this.onDrop(cardId, type, index);
        });
    }

    onDrop(cardId, targetType, targetIndex) {
        // Find Card (Simplistic search across all possible locations)
        let foundCard = null;
        let sourceLoc = null; // { type: 'aaa', index: 1 }

        // Search aaa
        this.cards.forEach((c, i) => {
            if (c && c.id === cardId) { foundCard = c; sourceLoc = { type: 'aaa', index: i }; }
        });
        // Search bbb
        if (!foundCard) {
            this.bbb.forEach((c, i) => {
                if (c && c.id === cardId) { foundCard = c; sourceLoc = { type: 'bbb', index: i }; }
            });
        }
        // Search hozon
        if (!foundCard && this.hozon && this.hozon.id === cardId) {
            foundCard = this.hozon; sourceLoc = { type: 'hozon', index: 0 };
        }

        if (!foundCard) return;

        // Validation for aaa/bbb index 0 (Usually blocked or allowed?)
        // If target is aaa[0] or bbb[0], maybe allow? User said index 1-13.
        // But let's allow moving anywhere for total freedom in manual mode.

        // Remove from source
        if (sourceLoc.type === 'aaa') this.cards[sourceLoc.index] = null;
        else if (sourceLoc.type === 'bbb') this.bbb[sourceLoc.index] = null;
        else if (sourceLoc.type === 'hozon') this.hozon = null;

        // Place in target
        // If target has card, SWAP? or Overwrite?
        // Real cards: user puts on top or swaps.
        // Let's implement Swap for convenience.
        let existingCard = null;
        if (targetType === 'aaa') {
            existingCard = this.cards[targetIndex];
            this.cards[targetIndex] = foundCard;
        } else if (targetType === 'bbb') {
            existingCard = this.bbb[targetIndex];
            this.bbb[targetIndex] = foundCard;
        } else if (targetType === 'hozon') {
            existingCard = this.hozon;
            this.hozon = foundCard;
        }

        // If existing card, move it back to source? (Swap)
        if (existingCard) {
            if (sourceLoc.type === 'aaa') this.cards[sourceLoc.index] = existingCard;
            else if (sourceLoc.type === 'bbb') this.bbb[sourceLoc.index] = existingCard;
            else if (sourceLoc.type === 'hozon') this.hozon = existingCard;
        }

        this.render();
    }

    // Set hozon method needs update to reflect visual state update
    setHozon(card) {
        this.hozon = card; // Update state
        this.render(); // Re-render whole because setHozon logic now integrated in render
    }
    // Enable Manual Mode
    enableManualMode() {
        this.cards.forEach(c => { if (c) c.setDraggable(true); });
        // this.setupDropZones(); // No longer needed, drop zones are set up during render
        this.render(); // Re-render to attach drag events
    }

    disableManualMode() {
        this.cards.forEach(c => { if (c) c.setDraggable(false); });
        this.render();
    }

    setupDropZones() {
        const containers = [
            ...document.querySelectorAll('#aaa-container .card-wrapper .empty-slot'),
            ...document.querySelectorAll('#aaa-container .card-wrapper .card'), // Allow dropping on existing cards to swap?
            // Actually, dropping on a wrapper is better
            ...document.querySelectorAll('#aaa-container .card-wrapper'),
            ...document.querySelectorAll('#bbb-container .card-wrapper'),
            document.getElementById('hozon-slot')
        ];

        // This is complex. We need persistent listeners or re-attach on render.
        // Since render clears HTML, we must attach listeners IN render or delegate.
        // Updating 'render' method to attach listeners if manual mode is active is cleanest.
    }

    handleDrop(e, targetContainer, index, arrayName) {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain'); // '2' from card-2 (ID)
        // Find card
        // We have strict 1-13 ID usually.
        // We need to find the card object in aaa, bbb, or hozon.
        // Currently 'aaa' is this.cards (index 0-13).
        // We don't have persistent 'bbb' array in memory in Deck class efficiently yet, just rendered.
        // TODO: We need real state for bbb.
    }
    // (Actual logic handling might be in Visualizer, but this helps)
    async swapVisual(indexA, indexB) {
        // This is for complex animation, for now we might just re-render 
        // or letting the Visualizer handle the DOM manipulation.
        // We will leave this empty for now and let Visualizer handle it.
    }
}
