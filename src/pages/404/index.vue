<template>
  <div class="error404">
    <div class="error404__wrapper">
      <span class="error404__title">Oops! This page was not found </span>
      <gl-404 />
      <span class="error404__subtitle">
        The page you are looking for has been removed
        <br>or temporarily unavailable.
      </span>
      <router-link
        class="gl-button gl-button--dark error404__button"
        tag="button"
        :to="{ name: 'analytics' }"
      >
        back to  homepage
      </router-link>
    </div>
  </div>
</template>

<script>
import Gl404 from '@/assets/svg/404.svg?inline'

export default {
  components: {
    Gl404,
  },
}
</script>
