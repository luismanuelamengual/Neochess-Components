
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

        .square {
            position: absolute;
            width: 12.5%;
            height: 12.5%;
            border: 1px solid gray;
        }

        .a1 { left: 0; top: 87.5%; }
        .b1 { left: 12.5%; top: 87.5%; }
        .c1 { left: 25%; top: 87.5%; }
        .d1 { left: 37.5%; top: 87.5%; }
        .e1 { left: 50%; top: 87.5%; }
        .f1 { left: 62.5%; top: 87.5%; }
        .g1 { left: 75%; top: 87.5%; }
        .h1 { left: 87.5%; top: 87.5%; }

        .a2 { left: 0; top: 75%; }
        .b2 { left: 12.5%; top: 75%; }
        .c2 { left: 25%; top: 75%; }
        .d2 { left: 37.5%; top: 75%; }
        .e2 { left: 50%; top: 75%; }
        .f2 { left: 62.5%; top: 75%; }
        .g2 { left: 75%; top: 75%; }
        .h2 { left: 87.5%; top: 75%; }

        .a3 { left: 0; top: 62.5%; }
        .b3 { left: 12.5%; top: 62.5%; }
        .c3 { left: 25%; top: 62.5%; }
        .d3 { left: 37.5%; top: 62.5%; }
        .e3 { left: 50%; top: 62.5%; }
        .f3 { left: 62.5%; top: 62.5%; }
        .g3 { left: 75%; top: 62.5%; }
        .h3 { left: 87.5%; top: 62.5%; }

        .a4 { left: 0; top: 50%; }
        .b4 { left: 12.5%; top: 50%; }
        .c4 { left: 25%; top: 50%; }
        .d4 { left: 37.5%; top: 50%; }
        .e4 { left: 50%; top: 50%; }
        .f4 { left: 62.5%; top: 50%; }
        .g4 { left: 75%; top: 50%; }
        .h4 { left: 87.5%; top: 50%; }

        .a5 { left: 0; top: 37.5%; }
        .b5 { left: 12.5%; top: 37.5%; }
        .c5 { left: 25%; top: 37.5%; }
        .d5 { left: 37.5%; top: 37.5%; }
        .e5 { left: 50%; top: 37.5%; }
        .f5 { left: 62.5%; top: 37.5%; }
        .g5 { left: 75%; top: 37.5%; }
        .h5 { left: 87.5%; top: 37.5%; }

        .a6 { left: 0; top: 25%; }
        .b6 { left: 12.5%; top: 25%; }
        .c6 { left: 25%; top: 25%; }
        .d6 { left: 37.5%; top: 25%; }
        .e6 { left: 50%; top: 25%; }
        .f6 { left: 62.5%; top: 25%; }
        .g6 { left: 75%; top: 25%; }
        .h6 { left: 87.5%; top: 25%; }

        .a7 { left: 0; top: 12.5%; }
        .b7 { left: 12.5%; top: 12.5%; }
        .c7 { left: 25%; top: 12.5%; }
        .d7 { left: 37.5%; top: 12.5%; }
        .e7 { left: 50%; top: 12.5%; }
        .f7 { left: 62.5%; top: 12.5%; }
        .g7 { left: 75%; top: 12.5%; }
        .h7 { left: 87.5%; top: 12.5%; }

        .a8 { left: 0; top: 0; }
        .b8 { left: 12.5%; top: 0; }
        .c8 { left: 25%; top: 0; }
        .d8 { left: 37.5%; top: 0; }
        .e8 { left: 50%; top: 0; }
        .f8 { left: 62.5%; top: 0; }
        .g8 { left: 75%; top: 0; }
        .h8 { left: 87.5%; top: 0; }

        .flipped .a1 { left: 87.5%; top: 0; }
        .flipped .b1 { left: 75%; top: 0; }
        .flipped .c1 { left: 62.5%; top: 0; }
        .flipped .d1 { left: 50%; top: 0; }
        .flipped .e1 { left: 37.5%; top: 0; }
        .flipped .f1 { left: 25%; top: 0; }
        .flipped .g1 { left: 12.5%; top: 0; }
        .flipped .h1 { left: 0; top: 0; }

        .flipped .a2 { left: 87.5%; top: 12.5%; }
        .flipped .b2 { left: 75%; top: 12.5%; }
        .flipped .c2 { left: 62.5%; top: 12.5%; }
        .flipped .d2 { left: 50%; top: 12.5%; }
        .flipped .e2 { left: 37.5%; top: 12.5%; }
        .flipped .f2 { left: 25%; top: 12.5%; }
        .flipped .g2 { left: 12.5%; top: 12.5%; }
        .flipped .h2 { left: 0; top: 12.5%; }

        .flipped .a3 { left: 87.5%; top: 25%; }
        .flipped .b3 { left: 75%; top: 25%; }
        .flipped .c3 { left: 62.5%; top: 25%; }
        .flipped .d3 { left: 50%; top: 25%; }
        .flipped .e3 { left: 37.5%; top: 25%; }
        .flipped .f3 { left: 25%; top: 25%; }
        .flipped .g3 { left: 12.5%; top: 25%; }
        .flipped .h3 { left: 0; top: 25%; }

        .flipped .a4 { left: 87.5%; top: 37.5%; }
        .flipped .b4 { left: 75%; top: 37.5%; }
        .flipped .c4 { left: 62.5%; top: 37.5%; }
        .flipped .d4 { left: 50%; top: 37.5%; }
        .flipped .e4 { left: 37.5%; top: 37.5%; }
        .flipped .f4 { left: 25%; top: 37.5%; }
        .flipped .g4 { left: 12.5%; top: 37.5%; }
        .flipped .h4 { left: 0; top: 37.5%; }

        .flipped .a5 { left: 87.5%; top: 50%; }
        .flipped .b5 { left: 75%; top: 50%; }
        .flipped .c5 { left: 62.5%; top: 50%; }
        .flipped .d5 { left: 50%; top: 50%; }
        .flipped .e5 { left: 37.5%; top: 50%; }
        .flipped .f5 { left: 25%; top: 50%; }
        .flipped .g5 { left: 12.5%; top: 50%; }
        .flipped .h5 { left: 0; top: 50%; }

        .flipped .a6 { left: 87.5%; top: 62.5%; }
        .flipped .b6 { left: 75%; top: 62.5%; }
        .flipped .c6 { left: 62.5%; top: 62.5%; }
        .flipped .d6 { left: 50%; top: 62.5%; }
        .flipped .e6 { left: 37.5%; top: 62.5%; }
        .flipped .f6 { left: 25%; top: 62.5%; }
        .flipped .g6 { left: 12.5%; top: 62.5%; }
        .flipped .h6 { left: 0; top: 62.5%; }

        .flipped .a7 { left: 87.5%; top: 75%; }
        .flipped .b7 { left: 75%; top: 75%; }
        .flipped .c7 { left: 62.5%; top: 75%; }
        .flipped .d7 { left: 50%; top: 75%; }
        .flipped .e7 { left: 37.5%; top: 75%; }
        .flipped .f7 { left: 25%; top: 75%; }
        .flipped .g7 { left: 12.5%; top: 75%; }
        .flipped .h7 { left: 0; top: 75%; }

        .flipped .a8 { left: 87.5%; top: 87.5%; }
        .flipped .b8 { left: 75%; top: 87.5%; }
        .flipped .c8 { left: 62.5%; top: 87.5%; }
        .flipped .d8 { left: 50%; top: 87.5%; }
        .flipped .e8 { left: 37.5%; top: 87.5%; }
        .flipped .f8 { left: 25%; top: 87.5%; }
        .flipped .g8 { left: 12.5%; top: 87.5%; }
        .flipped .h8 { left: 0; top: 87.5%; }
    </style>

    <div class="board">
        <div class="board-content">
            <div class="square dark a1"></div><div class="square light b1"></div><div class="square dark c1"></div><div class="square light d1"></div><div class="square dark e1"></div><div class="square light f1"></div><div class="square dark g1"></div><div class="square light h1"></div>
            <div class="square light a2"></div><div class="square dark b2"></div><div class="square light c2"></div><div class="square dark d2"></div><div class="square light e2"></div><div class="square dark f2"></div><div class="square light g2"></div><div class="square dark h2"></div>
            <div class="square dark a3"></div><div class="square light b3"></div><div class="square dark c3"></div><div class="square light d3"></div><div class="square dark e3"></div><div class="square light f3"></div><div class="square dark g3"></div><div class="square light h3"></div>
            <div class="square light a4"></div><div class="square dark b4"></div><div class="square light c4"></div><div class="square dark d4"></div><div class="square light e4"></div><div class="square dark f4"></div><div class="square light g4"></div><div class="square dark h4"></div>
            <div class="square dark a5"></div><div class="square light b5"></div><div class="square dark c5"></div><div class="square light d5"></div><div class="square dark e5"></div><div class="square light f5"></div><div class="square dark g5"></div><div class="square light h5"></div>
            <div class="square light a6"></div><div class="square dark b6"></div><div class="square light c6"></div><div class="square dark d6"></div><div class="square light e6"></div><div class="square dark f6"></div><div class="square light g6"></div><div class="square dark h6"></div>
            <div class="square dark a7"></div><div class="square light b7"></div><div class="square dark c7"></div><div class="square light d7"></div><div class="square dark e7"></div><div class="square light f7"></div><div class="square dark g7"></div><div class="square light h7"></div>
            <div class="square light a8"></div><div class="square dark b8"></div><div class="square light c8"></div><div class="square dark d8"></div><div class="square light e8"></div><div class="square dark f8"></div><div class="square light g8"></div><div class="square dark h8"></div>
        </div>
    </div>
`;

export class NeochessBoardElement extends HTMLElement {

    private boardElement: HTMLDivElement;
    private flipped: boolean = false;
    private skin: NeochessBoardSkin = {};

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.boardElement = this.shadowRoot.querySelector('.board');
        if (this.getAttribute('flipped') === 'true') {
            this.setFlipped(true);
        }
        this.updateLookAndFeel();
        this.updatePosition();
        window.onresize = () => this.updatePosition();
    }

    public setFlipped(flipped: boolean): void {
        this.flipped = flipped;
        if (flipped) {
            this.boardElement.classList.add('flipped');
        } else {
            this.boardElement.classList.remove('flipped');
        }
    }

    public isFlipped(): boolean {
        return this.flipped;
    }

    public setSkin(skin: NeochessBoardSkin): void {
        this.skin = skin;
        this.updateLookAndFeel();
    }

    public getSkin(): NeochessBoardSkin {
        return this.skin;
    }

    private updateLookAndFeel() {
        const backgroundColor = this.skin.backgroundColor ?? 'white';
        const lightColor = this.skin.lightColor ?? 'white';
        const darkColor = this.skin.darkColor ?? 'cornflowerblue';
        const borderColor = this.skin.borderColor ?? darkColor;
        const borderSize = this.skin.borderSize ?? 20;

        this.style.background = backgroundColor;
        if (borderSize > 0) {
            this.boardElement.style.padding = borderSize + 'px';
            this.boardElement.style.borderRadius = borderSize + 'px';
            this.boardElement.style.background = borderColor;
        } else {
            this.boardElement.style.padding = '0';
        }
        this.shadowRoot.querySelectorAll('.light').forEach(el => {
            const element = el as HTMLElement;
            element.style.background = lightColor;
        });
        this.shadowRoot.querySelectorAll('.dark').forEach(el => {
            const element = el as HTMLElement;
            element.style.background = darkColor;
        });
    }

    private updatePosition() {
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
