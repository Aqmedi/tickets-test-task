<template>
  <div class="pages">
    <div class="header">
        <router-link to="/">
        <icon-logo />
        </router-link> 
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './styles';

</style>
<script>
import IconLogo from './assets/icons/IconLogo.vue'
export default {
  components: {
    IconLogo,
  }
}
</script>
