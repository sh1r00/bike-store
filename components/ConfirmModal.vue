<template>
  <div class="container">
    <h1>
      Your items have been added to the cart!
    </h1>
    <button @click="$emit('close-confirm-modal')">
      Ok
    </button>
  </div>
</template>


<style scoped>
.container {
  height: 200px;
  width: 300px;
  background-color: white;
  margin: auto;
}
</style>
