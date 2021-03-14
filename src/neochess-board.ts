export class NeochessBoardElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const blueBox = document.createElement('div');
        blueBox.style.background = 'blue';
        blueBox.style.position = 'absolute';
        blueBox.style.top = '0';
        blueBox.style.left = '0';
        blueBox.style.width = '100%';
        blueBox.style.height = '100%';

        this.shadowRoot.appendChild(blueBox);
    }
}

if (!customElements.get('neochess-board')) {
    customElements.define('neochess-board', NeochessBoardElement);
}
