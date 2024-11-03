<template>
  <div class="container my-4 p-4 border rounded">
    <button class="btn btn-primary mb-3" @click="toggleVisibility" :disabled="loading">
      {{ isVisible ? 'Show Line Chart' : 'Show Bar Chart' }}
    </button>

    <div class="form-group mb-4" style="float:right">
      <label for="year-select" class="form-label">Select Year:</label>
      <select class="form-select" id="year-select" v-model="selectedYear" @change="updateChartData" :disabled="loading">
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border" role="status"></div>
      <center><span class="sr-only">Loading...</span></center>
    </div>

    <ErrorMessage v-if="errorMessage" :message="errorMessage" />

    <v-chart v-if="!loading && isVisible && !errorMessage" :option="barChartOption" style="height: 400px;"></v-chart>
    <v-chart v-if="!loading && !isVisible && !errorMessage" :option="lineChartOption" style="height: 400px;"></v-chart>
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { fetchSalesData } from '../service/service'
import ErrorMessage from './ErrorMessage.vue';

use([BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

export default defineComponent({
  components: {
    VChart,
    ErrorMessage
  },
  data() {
    return {
      selectedYear: '2024',
      barChartOption: {},
      lineChartOption: {},
      isVisible: true,
      loading: false,
      salesData: {},
      errorMessage: '',
    };
  },
  mounted() {
    this.updateChartData();
  },
  methods: {
    async updateChartData() {
      this.loading = true;
      this.errorMessage = ''; 
      try {
        const products = await fetchSalesData(this.selectedYear); 
        if (!products || products.length === 0) {
          throw new Error('No data available for the selected year.'); 
        }

        const categorySales = products.reduce((acc, product) => {
          const category = product.category;
          const existingCategory = acc.find(item => item.name === category);
          existingCategory ? existingCategory.value++ : acc.push({ name: category, value: 1 });
          return acc;
        }, []);
        
        const categories = categorySales.map(item => item.name);
        const values = categorySales.map(item => item.value);

        const historicalData = await Promise.all(
          ['2022', '2023', '2024'].map(async year => {
            const yearData = await fetchSalesData(year);
            return yearData.reduce((acc, product) => {
              acc[product.category] = (acc[product.category] || 0) + 1;
              return acc;
            }, {});
          })
        );

        this.updateCharts(categories, values, historicalData);
      } catch (error) {
        console.error('Error updating chart data:', error);
        this.errorMessage = error.message || 'An error occurred while fetching data.';
      } finally {
        this.loading = false;
      }
    },
    updateCharts(categories, values, historicalData) {
      this.barChartOption = {
        title: { text: `Sales Breakdown By Category ${this.selectedYear}`, left: 'center' },
        tooltip: { trigger: 'item' },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
        },
        yAxis: { type: 'value' },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: '10%',
        },
        series: [{ name: '', type: 'bar', data: values }],
      };
      this.lineChartOption = {
        title: { text: `Payment Trends by Type`, left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['2022', '2023', '2024'] },
        yAxis: { type: 'value' },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: '10%',
        },
        series: categories.map(category => ({
          name: category,
          type: 'line',
          data: historicalData.map(yearData => yearData[category] || 0),
        })),
      };
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
  },
});
</script>


<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
