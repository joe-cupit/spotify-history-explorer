import "./ListenChart.css"

import { useEffect, useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';

import { formatTrackTime } from "../utils/formatTrackTime";


export function ListenChart({ id }) {

  const [trackHistory, setTrackHistory] = useState(null);
  useEffect(() => {
    fetch(`/api/track/${id}/chart`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.xData.map((x) => formatTrackTime(x)));
        setTrackHistory(data);
      });
  }, [id]);

  return (
    <>
    <div className="listening-chart">
      <h3>Listening chart</h3>
      <div className="listening-chart-container">
        {trackHistory &&
          <LineChart
            xAxis={[{
              data: trackHistory.xData,
              valueFormatter: (value) => formatTrackTime(value),
            }]}
            series={[{
              data: trackHistory.yData,
              valueFormatter: (value) => (value*100).toFixed(1) + '%',
              showMark: false,
              area: true,
              color: '#208536',
              background: 'black',
              max: trackHistory.duration
            }]}
          /> 
        }
      </div>

    </div>
    </>
  )
}
