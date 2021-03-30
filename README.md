

[![npm version](https://badge.fury.io/js/%40neochess%2Fcomponents.svg)](https://badge.fury.io/js/%40neochess%2Fcomponents)
![](https://img.shields.io/github/forks/luismanuelamengual/Neochess-Components.svg?style=social&label=Fork)
![](https://img.shields.io/github/stars/luismanuelamengual/Neochess-Components.svg?style=social&label=Star)
![](https://img.shields.io/github/watchers/luismanuelamengual/Neochess-Components.svg?style=social&label=Watch)
![](https://img.shields.io/github/followers/luismanuelamengual.svg?style=social&label=Follow)

# Neochess-Components

Neochess Components is a library of chess components built as web components that are ready to be used within your favourite framework (React, Angular, Vue, etc) or with just vanilla javascript.

![alt text](https://luismanuelamengual.github.io/neochess/components/assets/images/screenshot.png)

## Installation

### With Node

To use this library install it by running:

```bash
npm i @neochess/components --save
```

and import the library in your main module/component/index.html:

```JS
import '@neochess/components';
```

### With CDN (bundled version of components)

Add the following script of the "bundled" components to the "head" of your html page

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@neochess/components{VERSION}/dist/neochess-components.bundle.js"></script>
```

## Usage

To use the components just add one of the components custom tags (neochess-board) in your html

```html
<neochess-board></neochess-board>
```

If you are using an Angular application you will have to add the CUSTOM_ELEMENTS_SCHEMA to the schemas of your ngModule

## Components

### NeochessBoard

#### Tag Name

`neochess-board`

#### Attributes

| Property            | Attribute             | Description | Type                                           | Default         |
| ------------------- | --------------------- | ----------- | ---------------------------------------------- | --------------- |
| `match` | `match` | The underlying match behind de component | `Match` | `null` |
| `theme` | `theme` | The colors scheme to use in the board | `NeochessBoardTheme` | `null` |
| `flipped` | `flipped` | Indicates whether black or white side should be down | `boolean` | `false` |
| `animated` | `animated` | Indicates whether there should be piece animations | `boolean` | `true` |
| `readonly` | `readonly` | Indicates whether user can make moves on the board | `boolean` | `false` |
| `showLastMoveHint` | `show-last-move-hint` | Show an arrow of the last move on the board | `boolean` | `true` |
| `showLegalMovesHint` | `show-legal-moves-hint` | Shows legal moves when selecting a piece | `boolean` | `true` |
| `showCoordinates` | `show-coordinates` | Shows or not the ranks and files coordinates | `boolean` | `true` |

## Contact

For bugs or for requirements please contact me at luismanuelamengual@gmail.com