import { useState } from 'react';

export default function ButtonSales() {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number | null>(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('../../../backend/services/sales.js');
      const data = await response.json();
      
      if (data.success) {
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to fetch total sales:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Get Total Sales'}
      </button>
      {total !== null && <p>Total Sales: ${total}</p>}
    </div>
  );
};
