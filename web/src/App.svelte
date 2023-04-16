<script lang="ts">
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import Board from "./lib/Board.svelte";
  import { io } from "socket.io-client";
  import { socket, flash, MessageType, currentGame } from "./store/store.ts";
  import Lobby from "./lib/Lobby.svelte";

  $: if ($flash) {
    setTimeout(() => ($flash = null), 3000);
  }

  let startGame = false;

  $socket = io("localhost:3000");

  $socket.on("connect", () => {
    console.log("Connected");
  });

  $: if ($currentGame?.roomID) {
    startGame = true;
  }

  onDestroy(() => {
    $socket.disconnect();
  });
</script>

<main>
  {#if startGame}
    <Board roomID={$currentGame.roomID} />
  {:else}
    <Lobby />
  {/if}
  {#if $flash}
    <div
      transition:fly={{
        y: 100,
        duration: 500,
      }}
      class:is-error={$flash.type === MessageType.ERROR}
      class:is-safe={$flash.type === MessageType.SUCCESS}
      class="message"
    >
      {$flash.label}
    </div>
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    width: 100%;
    background-color: #121212;
    display: grid;
    place-items: center;
    position: relative;
    overflow-y: hidden;
  }
  .message {
    position: absolute;
    bottom: 2em;
    left: 1em;
    width: 80%;
    padding: 1em;
    border-radius: 5px;
    color: white;
    border: 1px solid transparent;
  }
  .message.is-error {
    background-color: rgba(255, 0, 0, 0.4);
  }
  .message.is-safe {
    background-color: rgba(0, 255, 0, 0.2);
    border-color: rgba(0, 255, 0, 0.4);
  }
  @media screen and (min-width: 420px) {
    .message {
      left: auto;
      right: 1em;
      max-width: 350px;
    }
  }
</style>
