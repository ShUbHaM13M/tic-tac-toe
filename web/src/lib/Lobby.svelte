<script lang="ts">
  import { MessageType, socket } from "../store/store";
  import { flash } from "../store/store";
  import { createEventDispatcher, onDestroy } from "svelte";

  const dispatch = createEventDispatcher<{
    "start-game": { roomID: string };
  }>();

  let roomConnected = false;
  let roomID = "";
  let totalConnectedPlayers = 0;
  let countdown = 0;

  $: roomID = roomID.replaceAll(" ", "");

  $socket.on("room-joined", ({ totalPlayers }) => {
    totalConnectedPlayers = totalPlayers;
    roomConnected = true;
    $flash = {
      label: "Connected to a room.",
      type: MessageType.SUCCESS,
    };
    if (totalConnectedPlayers >= 2) startCountdown();
  });

  $socket.on("too-many-clients", () => {
    $flash = {
      label: "Room is already full.",
      type: MessageType.ERROR,
    };
  });

  function startCountdown() {
    const interval = setInterval(() => {
      if (countdown >= 5) {
        clearInterval(interval);
        dispatch("start-game", { roomID });
        return;
      }
      countdown = countdown + 1;
    }, 1000);
  }

  $socket.on("player-joined", ({ totalPlayers }) => {
    totalConnectedPlayers = totalPlayers;
    startCountdown();
  });

  function onClick() {
    if ($socket) {
      $socket.emit("join", { roomID });
    }
  }

  function copyToClickboard() {
    navigator.clipboard.writeText(roomID).then(() => {
      $flash = {
        label: "Room ID copied to clipboard",
        type: MessageType.SUCCESS,
      };
    });
  }

  onDestroy(() => {
    $socket.removeListener("player-joined");
    $socket.removeListener("too-many-clients");
    $socket.removeListener("room-joined");
  });
</script>

<div class="container">
  {#if roomConnected}
    <div class="waiting-room">
      <h2>Room connected</h2>
      <div style="margin-top: 6px" class="info">
        Connected Players: {totalConnectedPlayers}
      </div>
      {#if totalConnectedPlayers < 2}
        <button class="share-button" on:click={copyToClickboard}
          >{roomID}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            ><path
              d="M10 8V7C10 6.05719 10 5.58579 10.2929 5.29289C10.5858 5 11.0572 5 12 5H17C17.9428 5 18.4142 5 18.7071 5.29289C19 5.58579 19 6.05719 19 7V12C19 12.9428 19 13.4142 18.7071 13.7071C18.4142 14 17.9428 14 17 14H16M7 19H12C12.9428 19 13.4142 19 13.7071 18.7071C14 18.4142 14 17.9428 14 17V12C14 11.0572 14 10.5858 13.7071 10.2929C13.4142 10 12.9428 10 12 10H7C6.05719 10 5.58579 10 5.29289 10.2929C5 10.5858 5 11.0572 5 12V17C5 17.9428 5 18.4142 5.29289 18.7071C5.58579 19 6.05719 19 7 19Z"
              stroke="#121212"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          >
        </button>
      {:else}
        <h3 class="countdown">{countdown}</h3>
      {/if}
    </div>
  {:else}
    <div>
      <h2>Enter Room id</h2>
      <span class="info">
        New room will be created if the room does not exists.
      </span>
    </div>
    <hr />
    <div class="input-container">
      <label for="name">Name</label>
      <input type="text" placeholder="Name" name="name" id="name" pattern="" />
    </div>
    <div class="input-container">
      <label for="room_id">Enter Room ID: </label>
      <input
        bind:value={roomID}
        placeholder="Room ID (8 chars)"
        name="room_id"
        id="room_id"
        type="text"
        maxlength="8"
        pattern="[a-zA-Z0-9]+[a-zA-Z0-9]+"
      />
    </div>
    <button on:click={onClick} disabled={roomID.length < 8}>
      Create / Enter
    </button>
  {/if}
</div>

<style>
  .container {
    min-width: 250px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    gap: 1em;
    background-color: #232323;
    padding: 1em;
    border-radius: 10px;
    color: #fefefe;
    border: 2px solid rgba(255, 255, 255, 0.05);
  }
  h2 {
    text-align: center;
    margin-bottom: 8px;
  }
  hr {
    opacity: 0.2;
  }
  .info {
    color: #888;
    font-size: 14px;
    font-weight: 100;
  }
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  input {
    padding: 0.6em 1em;
    border-radius: 5px;
    border: none;
    font-family: monospace;
    font-size: 1rem;
    letter-spacing: 2px;
    outline-offset: 2px;
    outline: 2px solid transparent;
    transition: all ease-out 250ms;
  }
  input:focus {
    outline-color: rgba(255, 255, 255, 0.44);
  }
  button {
    margin-top: 0.4em;
    padding: 0.6em 1em;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color ease-out 250ms;
  }
  button:not(:disabled):hover,
  button:not(:disabled):focus {
    background-color: rgba(255, 255, 255, 0.6);
  }
  button:disabled {
    background-color: rgba(255, 255, 255, 255, 0.1);
    cursor: not-allowed;
  }
  .waiting-room {
    display: grid;
    text-align: center;
    grid-template-rows: 1fr 2fr 1fr;
  }
  .share-button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }
  .countdown {
    font-size: 2rem;
    font-weight: 600;
  }
</style>
