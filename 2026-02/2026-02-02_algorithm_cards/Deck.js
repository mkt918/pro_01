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

        // Apply current skin to new cards
        this.cards.forEach(c => { if (c) c.setSkin(this.skin); });

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
        // Find Card (Simplistic search across all possible locations)
        let foundCard = null;
        let sourceLoc = null; // { type: 'aaa', index: 1 }

        // Search aaa
        for (let i = 0; i < this.cards.length; i++) {
            const c = this.cards[i];
            if (c && c.id === cardId) {
                foundCard = c;
                sourceLoc = { type: 'aaa', index: i };
                break;
            }
        }

        // Search hozon
        if (!foundCard && this.hozon && this.hozon.id === cardId) {
            foundCard = this.hozon; sourceLoc = { type: 'hozon', index: 0 };
        }
        // Search max
        if (!foundCard && this.max && this.max.id === cardId) {
            foundCard = this.max; sourceLoc = { type: 'max', index: 0 };
        }
        // Search min
        if (!foundCard && this.min && this.min.id === cardId) {
            foundCard = this.min; sourceLoc = { type: 'min', index: 0 };
        }
        // Search foundAt
        if (!foundCard && this.foundAt && this.foundAt.id === cardId) {
            foundCard = this.foundAt; sourceLoc = { type: 'foundAt', index: 0 };
        }
        // Search target
        if (!foundCard && this.target && this.target.id === cardId) {
            foundCard = this.target; sourceLoc = { type: 'target', index: 0 };
        }

        if (!foundCard) return;

        // Remove from source
        if (sourceLoc.type === 'aaa') this.cards[sourceLoc.index] = null;
        else if (sourceLoc.type === 'hozon') this.hozon = null;
        else if (sourceLoc.type === 'max') this.max = null;
        else if (sourceLoc.type === 'min') this.min = null;
        else if (sourceLoc.type === 'foundAt') this.foundAt = null;
        else if (sourceLoc.type === 'target') this.target = null;

        // Place in target
        let existingCard = null;
        if (targetType === 'aaa') {
            existingCard = this.cards[targetIndex];
            this.cards[targetIndex] = foundCard;
        } else if (targetType === 'hozon') {
            existingCard = this.hozon;
            this.hozon = foundCard;
        } else if (targetType === 'max') {
            existingCard = this.max;
            this.max = foundCard;
        } else if (targetType === 'min') {
            existingCard = this.min;
            this.min = foundCard;
        } else if (targetType === 'foundAt') {
            existingCard = this.foundAt;
            this.foundAt = foundCard;
        } else if (targetType === 'target') {
            existingCard = this.target;
            this.target = foundCard;
        }

        // If existing card, move it back to source (Swap)
        if (existingCard) {
            if (sourceLoc.type === 'aaa') this.cards[sourceLoc.index] = existingCard;
            else if (sourceLoc.type === 'hozon') this.hozon = existingCard;
            else if (sourceLoc.type === 'max') this.max = existingCard;
            else if (sourceLoc.type === 'min') this.min = existingCard;
            else if (sourceLoc.type === 'foundAt') this.foundAt = existingCard;
            else if (sourceLoc.type === 'target') this.target = existingCard;
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
        this.cards.forEach(c => { if (c) c.setDraggable(true); });
        // this.setupDropZones(); // No longer needed, drop zones are set up during render
        this.render(); // Re-render to attach drag events
    }

    disableManualMode() {
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
}
