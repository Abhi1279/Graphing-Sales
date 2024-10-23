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
        <v-chart :option="pieChartOption" class="w-100" style="height: 400px; max-width: 600px;"></v-chart>
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
  
  use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);
  
  export default defineComponent({
    components: {
      VChart,
    },
    data() {
      return {
        selectedYear: '2024',
        pieChartOption: {},
        salesData: {
          2024: [
            { value: 23550, name: 'Visa' },
            { value: 12315, name: 'MasterCard' },
            { value: 765, name: 'Discover' },
            { value: 32182, name: 'PayPal' },
          ],
          2023: [
            { value: 23344, name: 'Visa' },
            { value: 11885, name: 'MasterCard' },
            { value: 591, name: 'Discover' },
            { value: 31255, name: 'PayPal' },
          ],
          2022: [
            { value: 24651, name: 'Visa' },
            { value: 11258, name: 'MasterCard' },
            { value: 921, name: 'Discover' },
            { value: 28907, name: 'PayPal' },
          ],
        },
      };
    },
    mounted() {
      this.updateChartData();
    },
    methods: {
      updateChartData() {
        this.pieChartOption = {
          title: {
            text: `Payment Types on 19th October ${this.selectedYear}`,
            subtext: 'Sales Breakdown by Payment Type',
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
              name: 'Payment Type',
              type: 'pie',
              radius: '50%',
              data: this.salesData[this.selectedYear],
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
      },
    },
  });
  </script>
  
  <style scoped>
  .container{
    max-width: 950px;
  }
  </style>
  