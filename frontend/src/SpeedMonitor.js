import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SpeedMonitor() {
  const [data, setData] = useState({ lastSpeed: null, notifications: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/api/index');
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Current Speed: {data.lastSpeed ? `${data.lastSpeed.toFixed(2)} Mbps` : 'Loading...'}</h2>
      <h3>Notifications</h3>
      <ul>
        {data.notifications.map((notification, index) => (
          <li key={index}>
            {`${new Date(notification.timestamp).toLocaleString()}: ${notification.message}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpeedMonitor;
