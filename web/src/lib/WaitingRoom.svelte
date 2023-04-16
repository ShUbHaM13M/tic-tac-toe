<script lang="ts">
  let playerConnected = false;
</script>

<div>
  Room connected
  <div class="">
    <span class="info">Waiting for one more player...</span>
  </div>
  {#if playerConnected}
    <p>Another player connected</p>
  {/if}
</div>
