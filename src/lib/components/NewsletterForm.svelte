<script lang="ts">

</script>

<form class="flex flex--middle flex--nogap"><span>Infolettre</span> <input type="email" name="email" placeholder="Courriel"> <button type="submit">→</button></form>

<style lang="scss">
  input[type="email"] {
    border-bottom: 1px solid;
    border-radius: 0;
    background-color: transparent;
    font-size: 1em;
    padding: 0 1em;
    margin-bottom: 0;
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