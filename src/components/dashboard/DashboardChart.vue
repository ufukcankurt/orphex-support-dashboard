<script setup lang="ts">
import { computed } from 'vue';
import { Chart } from 'highcharts-vue';
import { useRequestStore } from '../../stores/requestStore';
import { ALL_STATUSES, STATUS_COLORS } from '../../constants';
import type { Status } from '../../types';

const store = useRequestStore();

const chartOptions = computed(() => {
  const counts: Record<Status, number> = {
    New: 0,
    'In Progress': 0,
    'Waiting on Customer': 0,
    Done: 0,
  };

  store.requests.forEach((req) => {
    if (counts[req.status] !== undefined) {
      counts[req.status]++;
    }
  });

  const categories = ALL_STATUSES;
  const seriesData = ALL_STATUSES.map((status) => ({
    y: counts[status],
    color: STATUS_COLORS[status],
  }));

  return {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 300,
      style: { fontFamily: 'inherit' },
      spacingTop: 20,
    },
    title: {
      text: 'Request Status Distribution',
      align: 'left' as const,
      style: { fontSize: '16px', fontWeight: 'bold', color: '#1e293b' },
    },
    xAxis: {
      categories: categories,
      lineColor: '#e2e8f0',
      labels: {
        style: { color: '#64748b', fontSize: '12px' },
        autoRotation: [-45, -90],
      },
    },
    yAxis: {
      title: { text: undefined },
      gridLineColor: '#f1f5f9',
      labels: { style: { color: '#94a3b8' } },
      allowDecimals: false,
    },
    legend: { enabled: false },
    tooltip: {
      borderRadius: 8,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      shadow: { opacity: 0.05 },
      padding: 12,
      style: { color: '#334155' },
      headerFormat: '<span style="font-size: 11px; color: #64748b">{point.key}</span><br/>',
      pointFormat:
        '<span style="font-size: 14px; font-weight: bold; color: {point.color}">●</span> <b>{point.y}</b> requests',
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        pointWidth: 40,
        dataLabels: {
          enabled: true,
          style: { color: '#64748b', textOutline: 'none', fontWeight: 'normal' },
        },
      },
    },
    series: [
      {
        type: 'column' as const,
        name: 'Requests',
        data: seriesData,
      },
    ],
    credits: { enabled: false },
  };
});
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div
      v-if="store.isLoading && store.requests.length === 0"
      class="h-[300px] flex items-center justify-center text-slate-400"
    >
      Loading chart data...
    </div>

    <Chart v-else :options="chartOptions" />
  </div>
</template>
