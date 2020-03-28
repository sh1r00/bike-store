<template>
  <div class="container">
    <h2>
      Your items have been added to the cart!
    </h2>
    <button @click="$emit('close-confirm-modal')">
      Ok
    </button>
  </div>
</template>


<style scoped>
.container {
  height: auto;
  width: 300px;
  background-color: white;
  margin: auto;
  padding: 3em;
}
button {
  margin-top: 2.52em;
  min-height: 60px;
  min-width: 60px;
  width: 100%;
}
</style>
