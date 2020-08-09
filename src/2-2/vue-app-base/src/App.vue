<template>
  <div id="app">
    {{ dog }}
    <button @click="handleClick">1</button>
    <button @click="handleClick2">2</button>
    <button @click="handleClick3">3</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      o: 'object',
      dog: {}
    }
  },
  methods: {
    handleClick () {
      this.dog.name = 'Trump'
    },
    handleClick2 () {
      this.$set(this.dog, {
        name: 'Trump'
      })
    },
    handleClick3 () {
      this.dog = this.$observable({name: 'Trump'})
      // this.dog = {
      //   name: 'Trump'
      // }
    }
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
