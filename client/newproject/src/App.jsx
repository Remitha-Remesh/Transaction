import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import MonthSelector from './components/MonthSelector';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March

  return (
    <div>
      <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
      <StatisticsBox month={selectedMonth} />
      <TransactionsTable month={selectedMonth} />
      <BarChart month={selectedMonth} />
    </div>
  );
};

export default App;