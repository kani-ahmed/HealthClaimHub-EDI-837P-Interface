import React, { useEffect, useState } from 'react';
import './BillingHistory.css';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import BillingHistoryTable from './BillingHistoryTable';
import BillingStatistics from './BillingStatistics';

const BillingHistory = () => {
  const [billingData, setBillingData] = useState([]);
  const [searchFilter, setSearchFilter] = useState(''); // State for search filter
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        const token = await getIdToken();
        const response = await fetch('http://localhost:8080/api/billingHistory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch billing history');
        }

        const data = await response.json();
        setBillingData(data);
      } catch (error) {
        toast.error('Error fetching billing history');
        console.error('Error:', error);
      }
    };

    fetchBillingHistory();
  }, [getIdToken]);

  // Handle search filter input
  const handleSearchFilterChange = (filterValue) => {
    setSearchFilter(filterValue);
  };

  return (
    <div className="billing-history-container">
      <BillingStatistics billingData={billingData} />
      <h2>Billing History</h2>
      <BillingHistoryTable billingData={billingData} searchFilter={searchFilter} />
    </div>
  );
};

export default BillingHistory;
