import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BillingStatistics = ({ billingData }) => {
  // Labels for both charts will be the same
  const labels = billingData.map(user => `${user.firstName} ${user.lastName}`);

  // Data for the billing count chart
  const billingCountChartData = {
    labels,
    datasets: [
      {
        label: 'Total Claims Submitted', //Billing Dates Count
        data: billingData.map(user => user.dateRanges.length),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the total claim charge chart
  const totalClaimChargeChartData = {
    labels,
    datasets: [
      {
        label: 'Cumulative Claim Charges', // Updated label
        data: billingData.map(user => user.totalClaimCharge),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the charts can be customized further if needed
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <h2>Billing Statistics</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
        {/* Chart for Billing Count */}
        <div style={{ width: 'calc(50% - 10px)', height: '400px' }}>
          <Bar data={billingCountChartData} options={options} />
        </div>

        {/* Chart for Total Claim Charge */}
        <div style={{ width: 'calc(50% - 10px)', height: '400px' }}>
          <Bar data={totalClaimChargeChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BillingStatistics;


// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const BillingStatistics = ({ billingData }) => {
//   const labels = billingData.map(
//     (user) => user.firstName + ' ' + user.lastName
//   );
//   const data = billingData.map((user) => user.dateRanges.length);

//   const chartData = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Billings',
//         data: data,
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div>
//       <h2>Billing Statistics</h2>
//       <div style={{ width: '600px', height: '400px' }}>
//         <Bar data={chartData} options={options} />
//       </div>
//     </div>
//   );
// };

// export default BillingStatistics;
