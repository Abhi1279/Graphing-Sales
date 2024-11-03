<template>
  <div class="container my-4 p-4 border rounded">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="form-group mb-0 ms-auto">
        <label for="year-select" class="form-label me-2">Select Year:</label>
        <select
          class="form-select d-inline-block"
          id="year-select"
          v-model="selectedYear"
          @change="updateChartData"
          style="width: auto;"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <div v-if="loading" class="text-center my-4">
        <div class="spinner-border" role="status"></div>
        <center><span class="sr-only">Loading...</span></center>
      </div>
      <ErrorMessage v-if="errorMessage" :message="errorMessage" />
      <v-chart v-if="!loading && !errorMessage" :option="pieChartOption" class="w-100" style="height: 400px; max-width: 600px;"></v-chart>
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { fetchSalesData } from '../service/service'
import ErrorMessage from './ErrorMessage.vue';
use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default defineComponent({
  components: {
    VChart,
    ErrorMessage
  },
  data() {
  return {
    selectedYear: '2024',
    pieChartOption: {},
    loading: false,
    salesData: [],
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
        this.errorMessage('No data available for the selected year.');
      }

      const categorySales = products.reduce((acc, product) => {
        const category = product.category;
        const existingCategory = acc.find(item => item.name === category);

        if (existingCategory) {
          existingCategory.value += 1;
        } else {
          acc.push({ value: 1, name: category });
        }
        return acc;
      }, []);

      this.pieChartOption = {
        title: {
          text: `Sales Breakdown by Category ${this.selectedYear}`,
          subtext: 'Category-wise Sales Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 'bottom',
          textStyle: {
            fontWeight: 'bold',
            fontSize: 14,
          },
        },
        series: [
          {
            name: 'Sales',
            type: 'pie',
            radius: '50%',
            data: categorySales,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    } catch (error) {
      console.error('Error updating chart:', error);
      this.errorMessage = error.message || 'An error occurred while fetching data.';
    } finally {
      this.loading = false;
    }
  },
},

});
</script>

<style scoped>
.container {
  max-width: 950px;
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
