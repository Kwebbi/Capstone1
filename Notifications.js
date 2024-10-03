// Notifications.js
import React, { useState, useEffect } from 'react';

const Notifications = ({ babyId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(`/api/baby/${babyId}/notifications`);
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, [babyId]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
