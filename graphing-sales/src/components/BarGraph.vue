<template> 
  <div class="container my-4 p-4 border rounded">
    <button class="btn btn-primary mb-3" @click="toggleVisibility" :disabled="loading">
      {{ isVisible ? 'Show Line Chart' : 'Show Bar Chart' }}
    </button>

    <div class="form-group mb-4" style="float:right">
      <label for="year-select" class="form-label">Select Year:</label>
      <select
        class="form-select"
        id="year-select"
        v-model="selectedYear"
        @change="updateChartData"
        :disabled="loading"
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>
    </div>

    <div class="row">
      <div class="col-12">
        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border" role="status">
          </div>
          <center><span class="sr-only">Loading...</span></center>
        </div>
        
        <v-chart v-if="!loading && isVisible" :option="barChartOption" style="height: 400px;"></v-chart>
        <v-chart v-if="!loading && !isVisible" :option="lineChartOption" style="height: 400px;"></v-chart>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

export default defineComponent({
  components: {
    VChart,
  },
  data() {
    return {
      selectedYear: '2024',
      barChartOption: {},
      lineChartOption: {},
      isVisible: true,
      loading: false,
      salesData: {
        2024: {
          Visa: 23550,
          MasterCard: 12315,
          Discover: 765,
          PayPal: 32182,
        },
        2023: {
          Visa: 23344,
          MasterCard: 11885,
          Discover: 591,
          PayPal: 31255,
        },
        2022: {
          Visa: 24651,
          MasterCard: 11258,
          Discover: 921,
          PayPal: 28907,
        },
      },
    };
  },
  mounted() {
    this.updateChartData();
  },
  methods: {
    updateChartData() {
      this.loading = true;
      console.log('Loading state:', this.loading);

      setTimeout(() => {
        const selectedYearData = this.salesData[this.selectedYear];
        const categories = Object.keys(selectedYearData);
        const values = Object.values(selectedYearData);

        const historicalData = ['2022', '2023', '2024'].map((year) => {
          return Object.values(this.salesData[year]);
        });

        this.barChartOption = {
          title: {
            text: `Payment Types in 19 October ${this.selectedYear}`,
            subtext: 'Sales Breakdown by Payment Type',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisTick: {
              alignWithLabel: true,
            },
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Sales',
              type: 'bar',
              data: values,
              barWidth: '60%',
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

        this.lineChartOption = {
          title: {
            text: `Payment Trends by Type`,
            subtext: 'Sales Breakdown',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: categories,
            orient: "horizontal",
            left: 'center',
            top: '13%',
            itemGap: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true,
            top: '90px'
          },
          xAxis: {
            type: 'category',
            data: ['2022', '2023', '2024'],
            boundaryGap: false,
          },
          yAxis: {
            type: 'value',
          },
          series: categories.map((category) => ({
            name: category,
            type: 'line',
            data: historicalData.map(
              (yearData) => yearData[categories.indexOf(category)]
            ),
            smooth: true,
            emphasis: {
              focus: 'series',
            },
          })),
        };

        this.loading = false;
        console.log('Loading state:', this.loading);
      }, 1000);
    },
    toggleVisibility() {
      this.loading = true;
      setTimeout(() => {
        this.isVisible = !this.isVisible;
        this.loading = false;
      }, 1000);
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
