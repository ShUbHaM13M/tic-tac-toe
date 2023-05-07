<script context="module" lang="ts">
  export type TurnType = "X" | "O";
</script>

<script lang="ts">
  import Cell from "./Cell.svelte";
  import { socket, flash, MessageType } from "../store/store.ts";
  import { currentGame } from "../store/store.ts";

  let roomID = $currentGame.roomID;

  let state = Array.from<undefined | TurnType>({ length: 9 }).fill(undefined);
  let currentTurn: TurnType;
  let boardDisabled = false;

  currentGame.subscribe((data) => {
    currentTurn = data.currentTurn;
    state = data.state;
    boardDisabled = data.currentTurn !== data.assignedTurn;
  });

  let winState: { winner: TurnType; winMatrixIndex: number } = null;
  let opponentHovering: number = null;

  $socket.on("player-hovering", ({ cellNumber }) => {
    opponentHovering = cellNumber;
  });

  $socket.on("move-played", ({ gameState }) => {
    currentGame.update((prev) => ({
      ...prev,
      currentTurn: gameState.currentTurn,
      state: gameState.board,
    }));
  });

  $socket.on("game-won", (_winState) => {
    winState = _winState;
    $flash = {
      label: `${winState.winner} won the game!`,
      type:
        $currentGame.assignedTurn === winState.winner
          ? MessageType.SUCCESS
          : MessageType.ERROR,
    };
    console.log(winState.winMatrixIndex);
  });

  function onCellClick(index: number) {
    $socket &&
      $socket.emit("move", {
        index,
        roomID,
        currentTurn: $currentGame.assignedTurn,
      });
  }
</script>

<div
  style={`pointer-events: ${
    winState?.winner || boardDisabled ? "none" : "auto"
  }`}
  class="board"
>
  {#each state as cellState, index}
    <Cell
      opponentHovering={opponentHovering === index}
      on:click={() => onCellClick(index)}
      value={cellState}
      {index}
    />
  {/each}
  {#each new Array(8).fill(0) as _, index}
    <div
      class:show={index === (winState?.winMatrixIndex ?? -1)}
      class="line"
      data-index={index}
    />
  {/each}
</div>

<style>
  .board {
    position: relative;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    isolation: isolate;
  }
  .line {
    --one_third: 25%;
    --strike-animation-duration: 500ms;
    position: absolute;
    background-color: white;
    border-radius: 4px;
    transition: all ease-out var(--strike-animation-duration);
    z-index: 10;
  }

  .line:nth-of-type(1),
  .line:nth-of-type(2),
  .line:nth-of-type(3) {
    height: 1px;
    width: 94%;
    top: 17%;
    left: 50%;
    transform-origin: left center;
    transform: translateX(-50%) scaleX(0);
  }
  .line:nth-of-type(2) {
    top: 50%;
  }
  .line:nth-of-type(3) {
    top: 84%;
  }

  .line:nth-of-type(1).show,
  .line:nth-of-type(2).show,
  .line:nth-of-type(3).show {
    transform: translateX(-50%) scaleX(1);
  }

  .line:nth-of-type(4),
  .line:nth-of-type(5),
  .line:nth-of-type(6) {
    height: 94%;
    width: 1px;
    top: 50%;
    left: calc(var(--one_third) - 8%);
    transform-origin: top center;
    transform: translateY(-50%) scaleY(0);
  }
  .line:nth-of-type(5) {
    left: calc(var(--one_third) + 25%);
    transform: translateY(-50%) scaleY(0);
  }
  .line:nth-of-type(6) {
    left: calc(var(--one_third) + 58%);
    transform: translateY(-50%) scaleY(0);
  }
  .line:nth-of-type(4).show,
  .line:nth-of-type(5).show,
  .line:nth-of-type(6).show {
    height: 94%;
    transform: translateY(-50%) scaleY(1);
  }

  .line:nth-of-type(7),
  .line:nth-of-type(8) {
    top: 10%;
    left: 10%;
    height: 116%;
    width: 1px;
    transform-origin: center top;
  }
  .line:nth-of-type(7) {
    transform: rotateZ(-45deg) scaleY(0);
  }
  .line:nth-of-type(8) {
    left: auto;
    right: 10%;
    transform: rotateZ(45deg) scaleY(0);
  }
  .line:nth-of-type(7).show {
    transform: rotateZ(-45deg) scaleY(1);
  }
  .line:nth-of-type(8).show {
    transform: rotateZ(45deg) scaleY(1);
  }
  .line {
    opacity: 0;
  }
  .line.show {
    opacity: 1;
  }
</style>
