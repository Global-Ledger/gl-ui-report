<template>
  <div class="gl-loader">
    <img src="../../public/assets/img/Pre.gif" alt="loader" style="height: 50px">
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#383c54",
    },
  },
}
</script>
