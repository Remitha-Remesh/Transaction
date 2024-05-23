import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../api';

const StatisticsBox = ({ month }) => {
  const [statistics, setStatistics] = useState({ totalSale: 0, totalSold: 0, totalNotSold: 0 });

  useEffect(() => {
    const loadStatistics = async () => {
      const response = await fetchStatistics(month);
      setStatistics(response.data);
    };

    loadStatistics();
  }, [month]);

  return (
    <div>
      <div>Total Sale: {statistics.totalSale}</div>
      <div>Total Sold Items: {statistics.totalSold}</div>
      <div>Total Not Sold Items: {statistics.totalNotSold}</div>
    </div>
  );
};

export default StatisticsBox;