<template>
  <div>
    <div class="title">Information</div>
    <div class="items">
      <div class="item">
        <div class="name">Path:</div>
        <div class="value">{{ path }}</div>
      </div>
      <div class="item">
        <div class="name">Route Name:</div>
        <div class="value">{{ name }}</div>
      </div>
      <div class="item">
        <div class="name">Vue.js:</div>
        <div class="value">{{ vue }}</div>
      </div>
      <div class="item">
        <div class="name">Electron:</div>
        <div class="value">{{ electron }}</div>
      </div>
      <div class="item">
        <div class="name">Node:</div>
        <div class="value">{{ node }}</div>
      </div>
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">{{ platform }}</div>
      </div>
      <div class="item">
        <div class="name">Vuex:</div>
        <div class="value">3.6.2</div>
      </div>
      <div class="item">
        <div class="name">Vuex Examination:</div>
        <div class="value">{{ text }}</div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
    computed: {
        text() {
            return this.$store.state.DefaultVals.text;
        },
    },
    data() {
        return {
            electron: process.versions.electron,
            name: this.$route.name,
            node: process.versions.node,
            path: this.$route.path,
            platform: require('os').platform(),
            vue: '2.6.14',

        };
    },
};
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
