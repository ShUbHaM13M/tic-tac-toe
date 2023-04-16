<script lang="ts">
  import Cell from "./Cell.svelte";
  import { socket } from "../store/store.ts";

  export let roomID = "";

  console.log(roomID);

  type TurnTypes = "X" | "O";
  let currentTurn: TurnTypes = "X";

  let state = Array.from<undefined | TurnTypes>({ length: 9 }).fill(undefined);

  let winner: TurnTypes = null;

  const win_matrix = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkBoard() {
    for (let index = 0; index < 8; index++) {
      console.log(win_matrix[index][0]);
      if (
        state[win_matrix[index][0]] == "X" &&
        state[win_matrix[index][1]] == "X" &&
        state[win_matrix[index][2]] == "X"
      ) {
        winner = "X";
      }
    }

    for (let index = 0; index < 8; index++) {
      if (
        state[win_matrix[index][0]] == "O" &&
        state[win_matrix[index][1]] == "O" &&
        state[win_matrix[index][2]] == "O"
      ) {
        winner = "O";
      }
    }
    console.log(winner);
  }

  function onCellClick(index: number) {
    state = state.map((s, i) => (i === index ? currentTurn : s));
    currentTurn = currentTurn === "X" ? "O" : "X";
    $socket && $socket.emit("move", { index, currentTurn });
    checkBoard();
  }
</script>

<div style={`pointer-events: ${winner ? "none" : "auto"}`} class="board">
  {#each state as cellState, index}
    <Cell on:click={() => onCellClick(index)} value={cellState} />
  {/each}
</div>

<style>
  .board {
    max-width: fit-content;
    max-height: fit-content;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
</style>
