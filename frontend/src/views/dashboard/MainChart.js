import React, { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ monthlyData = [] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const handleColorSchemeChange = () => {
      if (chartRef.current) {
        setTimeout(() => {
          const chart = chartRef.current;
          if (chart.options && chart.options.scales) {
            const scales = chart.options.scales;
            scales.x.grid.borderColor = getStyle('--cui-border-color-translucent');
            scales.x.grid.color = getStyle('--cui-border-color-translucent');
            scales.x.ticks.color = getStyle('--cui-body-color');
            scales.y.grid.borderColor = getStyle('--cui-border-color-translucent');
            scales.y.grid.color = getStyle('--cui-border-color-translucent');
            scales.y.ticks.color = getStyle('--cui-body-color');
            chart.update();
          }
        });
      }
    };

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange);
    
    // Cleanup event listener
    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange);
    };
  }, [chartRef]);

  // Calculate max value for Y-axis
  const getMaxValue = () => {
    if (monthlyData.length > 0) {
      const maxDataValue = Math.max(...monthlyData.map(amount => amount / 29.5735));
      return Math.max(150, Math.ceil(maxDataValue * 1.2)); // Add 20% buffer
    }
    return 150;
  };

  // Prepare chart data
  const chartData = monthlyData.length > 0 
    ? monthlyData.map(amount => amount / 29.5735) // Convert to ounces
    : Array(12).fill(0).map(() => Math.floor(Math.random() * 100) + 40);

  // Get current month index for highlighting
  const currentMonth = new Date().getMonth();

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'My Intake',
            backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
            borderColor: getStyle('--cui-info'),
            pointBackgroundColor: monthlyData.length > 0
              ? (_, index) => index === currentMonth ? getStyle('--cui-danger') : getStyle('--cui-info')
              : getStyle('--cui-info'),
            pointHoverBackgroundColor: getStyle('--cui-info'),
            borderWidth: 2,
            pointRadius: monthlyData.length > 0
              ? (_, index) => index === currentMonth ? 6 : 4
              : 4,
            pointHoverRadius: 6,
            data: chartData,
            fill: true,
          },
          {
            label: 'Daily Goal',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-success'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 1,
            borderDash: [4, 4],
            data: Array(12).fill(85),
          },
          {
            label: 'Male Average',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-danger'),
            pointHoverBackgroundColor: getStyle('--cui-danger'),
            borderWidth: 1,
            borderDash: [8, 5],
            data: Array(12).fill(124),
          },
          {
            label: 'Female Average',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-warning'),
            pointHoverBackgroundColor: getStyle('--cui-warning'),
            borderWidth: 1,
            borderDash: [8, 5],
            data: Array(12).fill(92),
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} oz`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
              drawOnChartArea: false,
            },
            ticks: {
              color: getStyle('--cui-body-color'),
              callback: function(value, index) {
                // Abbreviate month names
                return this.getLabelForValue(value).substring(0, 3);
              }
            },
          },
          y: {
            beginAtZero: true,
            border: {
              color: getStyle('--cui-border-color-translucent'),
            },
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            max: getMaxValue(),
            ticks: {
              color: getStyle('--cui-body-color'),
              maxTicksLimit: 5,
              stepSize: Math.ceil(getMaxValue() / 5),
              callback: function(value) {
                return value + ' oz';
              }
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            hitRadius: 10,
            hoverRadius: 6,
            hoverBorderWidth: 3,
          },
        },
      }}
    />
  )
}

export default MainChart
