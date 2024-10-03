// DataReport.js
import React, { useEffect, useState } from 'react';

const DataReport = ({ babyId }) => {
  const [sleepAvg, setSleepAvg] = useState(0);
  const [feedingAvg, setFeedingAvg] = useState(0);
  const [diaperAvg, setDiaperAvg] = useState(0);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    // Fetch the weekly report data from backend
    const fetchData = async () => {
      const response = await fetch(`/api/baby/${babyId}/weekly-report`);
      const data = await response.json();

      setSleepAvg(data.sleepAvg);
      setFeedingAvg(data.feedingAvg);
      setDiaperAvg(data.diaperAvg);
      setMilestones(data.milestones);
    };

    fetchData();
  }, [babyId]);

  return (
    <div>
      <h2>Weekly Data Report</h2>
      <p>Average Sleep Time: {sleepAvg} hours</p>
      <p>Average Feedings: {feedingAvg} times</p>
      <p>Average Diaper Changes: {diaperAvg} times</p>
      <h3>Milestones:</h3>
      <ul>
        {milestones.map((milestone, index) => (
          <li key={index}>{milestone}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataReport;
