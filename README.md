

[![npm version](https://badge.fury.io/js/%40neochess%2Fcomponents.svg)](https://badge.fury.io/js/%40neochess%2Fcomponents)
![](https://img.shields.io/github/forks/luismanuelamengual/Neochess-Components.svg?style=social&label=Fork)
![](https://img.shields.io/github/stars/luismanuelamengual/Neochess-Components.svg?style=social&label=Star)
![](https://img.shields.io/github/watchers/luismanuelamengual/Neochess-Components.svg?style=social&label=Watch)
![](https://img.shields.io/github/followers/luismanuelamengual.svg?style=social&label=Follow)

# Neochess-Components

Neochess Components is a library of chess components built as web components that are ready to be used within your favourite framework (React, Angular, Vue, etc) or with just vanilla javascript.

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

## Contact

For bugs or for requirements please contact me at luismanuelamengual@gmail.com