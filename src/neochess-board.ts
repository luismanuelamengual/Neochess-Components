
const template = document.createElement('template');
template.innerHTML = `
    <style>
        *, ::after, ::before {
            box-sizing: border-box;
        }

        :host {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: white;
        }

        .board {
            position: absolute;
            padding: 30px;
            background: blue;
        }

        .board-content {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: red;
        }
    </style>
    <div class="board">
        <div class="board-content"></div>
    </div>
`;

export class NeochessBoardElement extends HTMLElement {

    private boardElement: HTMLDivElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.boardElement = this.shadowRoot.querySelector('.board');
        this.adjustBoardPosition();
        window.onresize = () => this.adjustBoardPosition();
    }

    public adjustBoardPosition() {
        if (this.offsetWidth >= this.offsetHeight) {
            this.boardElement.style.top = '0';
            this.boardElement.style.left = ((this.offsetWidth / 2) - (this.offsetHeight / 2)) + 'px';
            this.boardElement.style.height = '100%';
            this.boardElement.style.width = this.offsetHeight + 'px';
        } else {
            this.boardElement.style.top = ((this.offsetHeight / 2) - (this.offsetWidth / 2)) + 'px';
            this.boardElement.style.left = '0';
            this.boardElement.style.width = '100%';
            this.boardElement.style.height = this.offsetWidth + 'px';
        }
    }
}

if (!customElements.get('neochess-board')) {
    customElements.define('neochess-board', NeochessBoardElement);
}
