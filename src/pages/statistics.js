import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import moment from "moment";
import {
  Chart as Chartjs,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chartjs.register(
  LineElement,
  CategoryScale,
  PointElement,
  LinearScale,
  Tooltip
);

Chartjs.defaults.font.size = 12;
Chartjs.defaults.font.family = "black";

function Statistics() {
  const params = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const data = {
    labels: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ],
    datasets: [
      {
        label: "میزان بازدید در هفته",
        data: [570, 400, 350, 750, 450, 650, 680],
        lineTension: 0.3,
        pointRadius: 10,
        backgroundColor: "rgba(0, 204, 109, .2)",
        borderColor: "rgba(0, 204, 109, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          minRotation: 30,
          font: {
            size: 12,
            family: "black",
          },
        },
      },
      y: {
        suggestedMin: 200,
        suggestedMax: 850,
        ticks: {
          font: {
            size: 12,
            family: "black",
          },
        },
      },
    },
    responsive: true,
    // maintainAspectRatio: false,
  };

  return (
    <>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>آمار بازدیدها</h2>
      </div>
      <div className="statistics-page">
        <div className="statistics-item">
          <div className="title-flx">
            <div>
              <span></span>
              <h4>نمودار خطی</h4>
            </div>
            <cite>در هفته گذشته</cite>
          </div>
          <div className="chart">
            <Line options={options} data={data} height={300} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Statistics;
