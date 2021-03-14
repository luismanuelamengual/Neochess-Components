
const template = document.createElement('template');
template.innerHTML = `
    <style>
        *, ::after, ::before {
            box-sizing: border-box;
        }

        .board-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .board {
            position: absolute;
            width: 100%;
            height: 100%;
            max-width: 100vh;
            max-height: 100vw;
            left: 50%;
            top: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            border: 3px solid red;
        }
    </style>
    <div class="board-wrapper">
        <div class="board"></div>
    </div>
`;

export class NeochessBoardElement extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

if (!customElements.get('neochess-board')) {
    customElements.define('neochess-board', NeochessBoardElement);
}
