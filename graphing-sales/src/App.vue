<template>
 <PieChart/>
 <BarGraph/>
</template>

<script>
import BarGraph from './components/BarGraph.vue';
import PieChart from './components/PieChart.vue';

export default {
  name: 'App',
  components: {
    PieChart,
    BarGraph
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
