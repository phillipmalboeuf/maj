<script lang="ts">

</script>

<form class="flex flex--middle flex--nogap"><span>Infolettre</span> <input type="email" name="email" placeholder="Courriel"> <button type="submit">→</button></form>

<style lang="scss">
  input {
    border: none;
    border-bottom: 1px solid;
    background-color: transparent;
    font-size: 1em;
    line-height: 1;
    padding: 0 1em;
    color: currentColor;
    pointer-events: auto;

    &::placeholder {
      color: currentColor;
    }
  }

  button {
    pointer-events: auto;
    padding: 0;
    border: none;
    border-radius: 0;
  }
</style>