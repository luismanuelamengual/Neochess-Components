# NeochessBoard

This components shows a chessboard in which you can make movements, show static positions, retrieve and set FEN and PGN positions.

## Tag

```html
<neochess-board></neochess-board>
```

## Attributes

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
