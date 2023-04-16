<script lang="ts">
  export let value: string | undefined;
</script>

<button disabled={value !== undefined} on:click class="cell">
  {value ? value : ""}
</button>

<style>
  button {
    height: 100px;
    width: 100px;
    background-color: #232323;
    border: none;
    color: white;
    font-size: 1.2rem;
    transition: all ease-out 100ms;
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
</style>
