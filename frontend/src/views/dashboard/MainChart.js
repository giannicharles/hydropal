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
    
    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange);
    };
  }, [chartRef]);

  // Calculate max value for Y-axis
  const getMaxValue = () => {
    if (monthlyData.length > 0) {
      try {
        // Extract amounts from monthlyData whether it's an array of numbers or objects
        const amounts = monthlyData.map(item => {
          if (typeof item === 'number') return item;
          return item?.amount || item?.total || 0;
        });
        const maxDataValue = Math.max(...amounts.map(amount => amount / 29.5735));
        return Math.max(150, Math.ceil(maxDataValue * 1.2));
      } catch (error) {
        console.error('Error calculating max value:', error);
      }
    }
    return 150;
  };

  // Prepare chart data - create array of 12 months with actual data or 0
  const prepareMonthlyChartData = () => {
    if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
      return Array(12).fill(0);
    }

    const chartData = Array(12).fill(0);

    try {
      // Handle array of numbers
      if (typeof monthlyData[0] === 'number') {
        monthlyData.slice(0, 12).forEach((amount, index) => {
          chartData[index] = amount / 29.5735;
        });
      } 
      // Handle array of objects
      else if (typeof monthlyData[0] === 'object') {
        monthlyData.forEach(item => {
          const monthIndex = item.month !== undefined ? 
                          (item.month > 11 ? item.month - 1 : item.month) : // Handle 1-12 vs 0-11
                          monthlyData.indexOf(item);
          
          if (monthIndex >= 0 && monthIndex < 12) {
            const amount = item.amount || item.total || 0;
            chartData[monthIndex] = amount / 29.5735;
          }
        });
      }
    } catch (error) {
      console.error('Error processing monthly data:', error);
    }

    return chartData;
  };

  const chartData = prepareMonthlyChartData();
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
            pointBackgroundColor: (context) => {
              const index = context.dataIndex;
              return index === currentMonth ? getStyle('--cui-info') : getStyle('--cui-info');
            },
            pointHoverBackgroundColor: getStyle('--cui-info'),
            borderWidth: 2,
            pointRadius: (context) => {
              const index = context.dataIndex;
              return index === currentMonth ? 6 : 4;
            },
            pointHoverRadius: 6,
            data: chartData,
            fill: true,
          },
          {
            label: 'Daily Goal',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-success'),
            pointBackgroundColor: (context) => {
              const index = context.dataIndex;
              return index === currentMonth ? getStyle('--cui-success') : getStyle('--cui-success');
            },
            pointHoverBackgroundColor: getStyle('--cui-success'),
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2,
            borderDash: [4, 4],
            data: Array(12).fill(85),
            fill: false,
          },
          {
            label: 'Men Recommended',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-primary'),
            pointBackgroundColor: (context) => {
              const index = context.dataIndex;
              return index === currentMonth ? getStyle('--cui-primary') : getStyle('--cui-primary');
            },
            pointHoverBackgroundColor: getStyle('--cui-primary'),
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2,
            borderDash: [8, 5],
            data: Array(12).fill(124),
            fill: false,
          },
          {
            label: 'Women Recommended',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-warning'),
            pointBackgroundColor: (context) => {
              const index = context.dataIndex;
              return index === currentMonth ? getStyle('--cui-warning') : getStyle('--cui-warning');
            },
            pointHoverBackgroundColor: getStyle('--cui-warning'),
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2,
            borderDash: [8, 5],
            data: Array(12).fill(92),
            fill: false,
          },
          {
            label: 'Minimum Healthy',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-secondary'),
            pointBackgroundColor: (context) => {
              const index = context.dataIndex;
              return index === currentMonth ? getStyle('--cui-secondary') : getStyle('--cui-secondary');
            },
            pointHoverBackgroundColor: getStyle('--cui-secondary'),
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 2,
            data: Array(12).fill(64),
            fill: false,
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
