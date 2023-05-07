<script lang="ts">
  import { onDestroy } from "svelte";
  import { socket, currentGame } from "../store/store";

  export let value: string | undefined;
  export let opponentHovering = false;
  export let index: number;

  $: if (opponentHovering === true) {
    setTimeout(() => {
      opponentHovering = false;
    }, 2000);
  }

  onDestroy(() => {
    $socket.removeListener();
  });
</script>

<button
  on:click
  class="cell"
  class:opponentHovering
  on:mouseenter={() => {
    $socket.emit("hover", { cellNumber: index, roomID: $currentGame.roomID });
  }}
  on:pointerdown={() => {
    $socket.emit("hover", { cellNumber: index, roomID: $currentGame.roomID });
  }}
>
  {value ? value : ""}
</button>

<style>
  button {
    --size: 80px;
    height: var(--size);
    width: var(--size);
    background-color: #232323;
    border: none;
    color: #fefefe;
    font-size: 1.2rem;
    transition: all ease-out 200ms;
    cursor: pointer;
    outline: none;
  }
  .cell:disabled {
    cursor: not-allowed;
  }
  .cell:not(:disabled):hover,
  .cell:focus {
    filter: brightness(80%);
  }
  .cell:nth-child(1) {
    border-top-left-radius: 10px;
  }
  .cell:nth-child(3) {
    border-top-right-radius: 10px;
  }
  .cell:nth-child(7) {
    border-bottom-left-radius: 10px;
  }
  .cell:nth-child(9) {
    border-bottom-right-radius: 10px;
  }
  .cell:nth-child(2),
  .cell:nth-child(5),
  .cell:nth-child(8) {
    border-inline: 2px solid rgba(255, 255, 255, 0.1);
  }
  .cell:nth-child(4),
  .cell:nth-child(5),
  .cell:nth-child(6) {
    border-block: 2px solid rgba(255, 255, 255, 0.1);
  }
  .cell.opponentHovering {
    background-color: rgba(145, 0, 0, 0.4);
  }
</style>
