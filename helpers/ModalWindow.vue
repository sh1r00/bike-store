<!--

TYPE:
  Vue Component 

PURPOSE:  
  Shows a modal window in the center of the viewport

  Provides a button which closes the modal

OPTIONS:
  Parent (caller) must provide the content

-->
<template>
  <div id="modal" :class="{ show : modalOpen }">
    <button class="modal-close" @click="modalOpen = false">
      &times;
    </button>

    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalOpen: false
    }
  },

  watch: {
    modalOpen() {
      const className = 'modal-open'
      if (this.modalOpen) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
      }
    }
  },

  created() {
    document.addEventListener('keyup', this.escapeKeyListener)
  },

  destroyed() {
    document.removeEventListener('keyup', this.escapeKeyListener)
  },

  methods: {
    escapeKeyListener(evt) {
      if (evt.keyCode === 27 && this.modalOpen) {
        this.modalOpen = false
      }
    }
  }
}
</script>


<style>
#modal {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.55);
  overflow-y: scroll;
}

#modal.show {
  display: block;
}

.modal-content {
  height: 100%;
  max-width: 105vh;
  padding-top: 12vh;
  margin: 0 auto;
  position: relative;
}

.modal-content img {
  max-width: 100%;
}

body.modal-open {
  overflow: hidden;
  /* position: fixed;  leads to strange formatting*/
}

.modal-close {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0px 28px 8px;
  font-size: 4em;
  width: auto;
  height: auto;
  background: transparent;
  border: 0;
  outline: none;
  color: #ffffff;
  z-index: 1000;
  font-weight: 100;
  line-height: 1;
}
</style>
