import { Card } from './Card.js';

export class Deck {
    constructor() {
        this.cards = [];
        this.hozon = null; // hozon state
        this.max = null;   // max state
        this.min = null;   // min state
        this.min = null;   // min state
        this.foundAt = null; // search result state
        this.target = null; // target card state
        this.skin = 'trump';
        this.isManualMode = false;
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

    // Helper to create a card (ex: for target slot)
    createCard(suit, value, id) {
        return new Card(suit, value, id);
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

        this.hozon = null;
        this.max = null;
        this.min = null;
        this.min = null;
        this.foundAt = null;
        this.target = null;

        // Apply current skin to new cards and respect manual mode
        this.cards.forEach(c => {
            if (c) {
                c.setSkin(this.skin);
                if (this.isManualMode) c.setDraggable(true);
            }
        });

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

        // Render Hozon
        const hozonSlot = document.getElementById('hozon-slot');
        if (hozonSlot) {
            hozonSlot.innerHTML = '';
            this.setupDropZone(hozonSlot, 0, 'hozon'); // 0 index dummy
            if (this.hozon) {
                const el = this.hozon.createDOMElement();
                if (this.hozon.isDraggable) el.draggable = true;
                hozonSlot.appendChild(el);
            }
        }

        // Render Max
        const maxSlot = document.getElementById('max-slot');
        if (maxSlot) {
            maxSlot.innerHTML = '';
            this.setupDropZone(maxSlot, 0, 'max');
            if (this.max) {
                const el = this.max.createDOMElement();
                if (this.max.isDraggable) el.draggable = true;
                maxSlot.appendChild(el);
            }
        }

        // Render Min
        const minSlot = document.getElementById('min-slot');
        if (minSlot) {
            minSlot.innerHTML = '';
            this.setupDropZone(minSlot, 0, 'min');
            if (this.min) {
                const el = this.min.createDOMElement();
                if (this.min.isDraggable) el.draggable = true;
                minSlot.appendChild(el);
            }
        }

        // Render FoundAt
        const foundSlot = document.getElementById('found-slot');
        if (foundSlot) {
            foundSlot.innerHTML = '';
            this.setupDropZone(foundSlot, 0, 'foundAt');
            if (this.foundAt) {
                const el = this.foundAt.createDOMElement();
                if (this.foundAt.isDraggable) el.draggable = true;
                foundSlot.appendChild(el);
            }
        }

        // Render Target
        const targetSlot = document.getElementById('target-slot');
        if (targetSlot) {
            targetSlot.innerHTML = '';
            this.setupDropZone(targetSlot, 0, 'target');
            if (this.target) {
                const el = this.target.createDOMElement();
                // Target is usually reference, maybe not draggable by default? 
                // Let's allow drag if manual mode.
                if (this.target.isDraggable) el.draggable = true;
                targetSlot.appendChild(el);
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
        // Find Source Card
        let foundCard = null;

        // Search aaa
        for (let i = 0; i < this.cards.length; i++) {
            const c = this.cards[i];
            if (c && c.id === cardId) {
                foundCard = c;
                break;
            }
        }
        // Search others
        if (!foundCard && this.hozon && this.hozon.id === cardId) foundCard = this.hozon;
        if (!foundCard && this.max && this.max.id === cardId) foundCard = this.max;
        if (!foundCard && this.min && this.min.id === cardId) foundCard = this.min;
        if (!foundCard && this.foundAt && this.foundAt.id === cardId) foundCard = this.foundAt;
        if (!foundCard && this.target && this.target.id === cardId) foundCard = this.target;

        if (!foundCard) return;

        // --- COPY LOGIC START ---

        // 1. Save State for Undo
        this.saveManualState();

        // 2. Clone the found card (New ID)
        const newCard = this.cloneCardForCopy(foundCard);

        // 3. Place in target (Overwrite)
        // No need to remove from source because it's a Copy operation.
        // No need to swap existing card back, because we overwrite.
        // Simple!

        if (targetType === 'aaa') {
            this.cards[targetIndex] = newCard;
        } else if (targetType === 'hozon') {
            this.hozon = newCard;
        } else if (targetType === 'max') {
            this.max = newCard;
        } else if (targetType === 'min') {
            this.min = newCard;
        } else if (targetType === 'foundAt') {
            this.foundAt = newCard;
        } else if (targetType === 'target') {
            this.target = newCard;
        }

        this.render();
    }

    setSlots({ hozon, max, min, foundAt, target } = {}) {
        if (hozon !== undefined) this.hozon = hozon;
        if (max !== undefined) this.max = max;
        if (min !== undefined) this.min = min;
        if (foundAt !== undefined) this.foundAt = foundAt;
        if (target !== undefined) this.target = target;
        this.render();
    }

    // Individual setters for backward compatibility
    setHozon(card) {
        this.setSlots({ hozon: card });
    }

    setMax(card) {
        this.setSlots({ max: card });
    }

    setMin(card) {
        this.setSlots({ min: card });
    }

    setFoundAt(card) {
        this.setSlots({ foundAt: card });
    }
    // Enable Manual Mode
    enableManualMode() {
        this.isManualMode = true;
        this.cards.forEach(c => { if (c) c.setDraggable(true); });
        // this.setupDropZones(); // No longer needed, drop zones are set up during render
        this.render(); // Re-render to attach drag events
    }

    disableManualMode() {
        this.isManualMode = false;
        this.cards.forEach(c => { if (c) c.setDraggable(false); });
        this.render();
    }

    setSkin(skinType) {
        this.skin = skinType;
        // Apply to all current cards
        this.cards.forEach(c => { if (c) c.setSkin(skinType); });
        if (this.hozon) this.hozon.setSkin(skinType);
        if (this.max) this.max.setSkin(skinType);
        if (this.min) this.min.setSkin(skinType);
        if (this.foundAt) this.foundAt.setSkin(skinType);
        if (this.target) this.target.setSkin(skinType);
        this.render();
    }

    // --- Manual Mode Improvements (Undo & Copy) ---

    // Snapshot structure:
    // { cards: [...values], hozon: val, max: val, min: val, foundAt: val, target: val }
    // Only storing values/IDs is enough to reconstruct, but since objects have ID/Suit...
    // Storing deep clones of state data is safer.
    // Simplifying: Store copies of the Card objects (or null) for each slot.

    saveManualState() {
        if (!this.manualHistory) this.manualHistory = [];

        // LIMIT History to 5
        if (this.manualHistory.length >= 5) {
            this.manualHistory.shift(); // Remove oldest
        }

        const state = {
            cards: this.cards.map(c => c ? this.cloneCard(c) : null),
            hozon: this.hozon ? this.cloneCard(this.hozon) : null,
            max: this.max ? this.cloneCard(this.max) : null,
            min: this.min ? this.cloneCard(this.min) : null,
            foundAt: this.foundAt ? this.cloneCard(this.foundAt) : null,
            target: this.target ? this.cloneCard(this.target) : null
        };
        this.manualHistory.push(state);
    }

    undoManualState() {
        if (!this.manualHistory || this.manualHistory.length === 0) return;

        const state = this.manualHistory.pop();
        if (!state) return;

        this.cards = state.cards;
        this.hozon = state.hozon;
        this.max = state.max;
        this.min = state.min;
        this.foundAt = state.foundAt;
        this.target = state.target;

        this.render();
    }

    cloneCard(card) {
        // Return a new Card instance with same properties
        // IMPORTANT: We might want a NEW unique ID for true visual independence,
        // BUT for 'Snapshot' restore, we want the EXACT SAME ID to look like the same card coming back.
        // So for Undo: Keep ID.
        // For Copy-Drag: Generate New ID.
        const newC = new Card(card.suit, card.value, card.id);
        newC.setSkin(this.skin);
        newC.setDraggable(true); // Ensure draggable if restoring in manual mode
        return newC;
    }

    cloneCardForCopy(card) {
        // For drag-copy operation: New ID to avoid conflict
        const newId = Math.floor(Math.random() * 1000000);
        const newC = new Card(card.suit, card.value, newId);
        newC.setSkin(this.skin);
        newC.setDraggable(true);
        return newC;
    }
}
