export class NeochessBoardElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
}

customElements.define('neochess-board', NeochessBoardElement);
