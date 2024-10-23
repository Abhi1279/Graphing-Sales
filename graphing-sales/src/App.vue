<template>
  <div class="container mt-4">
    <div class="row">
      <h3 class="mb-0 mx-auto mx-4">Sales Breakdown by Payment Type</h3>
      <div class="col-md-6">
        <PieChart />
      </div>
      
      <div class="col-md-6">
        <BarGraph />
      </div>
    </div>
  </div>
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
