export class Card {
  constructor(suit, value, id) {
    this.suit = suit; // 'spades', 'hearts', 'diamonds', 'clubs'
    this.value = value; // 1-13
    this.id = id; // Unique ID for tracking DOM elements

    this.element = null;
    this.isDraggable = false;
  }

  getSuitSymbol() {
    switch (this.suit) {
      case 'spades': return '♠';
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      default: return '?';
    }
  }

  getDisplayValue() {
    switch (this.value) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return this.value.toString();
    }
  }

  getColor() {
    return (this.suit === 'hearts' || this.suit === 'diamonds') ? 'red' : 'black';
  }

  createDOMElement() {
    const div = document.createElement('div');
    div.classList.add('card');
    div.classList.add(this.getColor());
    div.id = `card-${this.id}`;
    div.dataset.value = this.value;

    const topSuit = document.createElement('div');
    topSuit.className = 'suit-top';
    topSuit.textContent = this.getSuitSymbol();
    if (this.isDraggable) {
      div.draggable = true;
      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', String(this.id));
        e.dataTransfer.effectAllowed = 'move';
        div.classList.add('dragging');
      });
      div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
      });
    }

    // Simplified layout: Just Value and Suit centered for now, 
    // or we can make it look like a real card with top/bottom corners.
    // Let's go with Center Value + Suit for readability for kids.

    // Create value and suit elements using DOM API
    const valueDiv = document.createElement('div');
    valueDiv.className = 'value';
    valueDiv.textContent = this.getDisplayValue();

    const suitDiv = document.createElement('div');
    suitDiv.className = 'suit';
    suitDiv.textContent = this.getSuitSymbol();

    div.appendChild(valueDiv);
    div.appendChild(suitDiv);

    this.element = div;
    return div;
  }

  highlight(type) {
    if (!this.element) return;
    this.removeHighlights();
    this.element.classList.add(type); // 'compare', 'sorted', 'selected'
  }

  removeHighlights() {
    if (!this.element) return;
    this.element.classList.remove('compare', 'sorted', 'selected', 'swap');
  }

  setDraggable(bool) {
    this.isDraggable = bool;
    if (this.element) {
      this.element.draggable = bool;
      // Re-render essentially needed to attach events properly or just toggling attribute is valid for CSS but events need conditional attachment?
      // Actually, adding events once is fine if we check 'draggable' state?
      // No, easiest is to let createDOMElement handle it or just toggle attribute.
      // But my event listener was inside createDOMElement.
      // Let's rely on createDOMElement re-run by render(), OR attach conditionally.
      // Since render rebuilds DOM, changing this property and calling deck.render() is safe.
    }
  }
}
