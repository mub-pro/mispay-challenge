import { Chart } from 'react-google-charts'

export default function ChartView ({ data }) {
  const chartOprions = {
    chartArea: { width: "50%" },
    hAxis: {
      title: "Min Estimated Diameter (KM)",
      minValue: 0
    },
    vAxis: {
      title: "NEO names"
    },
    height: 600 
  }

  if (data.length > 1) {
    return (
      <div>
        <Chart
          chartType='BarChart'
          data={data}
          options={chartOprions}
        />
      </div>
    )
  }
}