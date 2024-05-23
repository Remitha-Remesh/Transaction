import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchBarChartData } from '../api';

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const loadChartData = async () => {
      const response = await fetchBarChartData(month);
      const data = response.data;
      setChartData({
        labels: data.labels,
        datasets: [{
          label: 'Price Range',
          data: data.values,
          backgroundColor: 'rgba(75,192,192,0.6)',
        }],
      });
    };

    loadChartData();
  }, [month]);

  return <Bar data={chartData} />;
};

export default BarChart;