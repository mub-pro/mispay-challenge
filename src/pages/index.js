import NeoService from '@/services/neoService'
import React from 'react'
import { useEffect, useState } from 'react' 
import { Chart } from 'react-google-charts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import myData from '../../public/browse.json'

export default function Home() {
  const [chartData, setChartData] = useState([])

  // handle various states of data fetching
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [error, setError] = useState({ hasError: false, message: '' })


  async function getNeoData(orbitalBody) {
    setIsDataLoading(true)

    orbitalBody = orbitalBody === 'None' ? null : orbitalBody

    try {
      // const data = await NeoService.getNeoData()

      // init chart data
      var generateChartData = []

      // push NEOs from the source
      myData.near_earth_objects.map((object, index) => {
        if (orbitalBody && object.close_approach_data[0].orbiting_body !== orbitalBody) return
        // push object name and KM esitmated diameter
        generateChartData.push([object.name, object.estimated_diameter.kilometers.estimated_diameter_min, object.estimated_diameter.kilometers.estimated_diameter_max])
        
        // sort the data by average of min and max estimated diameter by compare first and second element
        generateChartData = generateChartData.sort((firstObject, secondObject) => {
          const avgA = (firstObject[1] + firstObject[2]) / 2
          const avgB = (secondObject[1] + secondObject[2]) / 2
          return avgB - avgA
        })
      })
      
      // finally push the chart title at first index, because this is how to dealing with chart data in the library
      generateChartData.unshift(["", "Min Estimated Diameter", "Max Estimated Diameter"])

      setChartData(generateChartData)
    } catch (error) {
      setError({ hasError: true, message: error.response?.data?.error?.code || error.message })
      console.log(error)
    }

    setIsDataLoading(false)
  }

  // async function filterChartData(orbitalBody) {
  //   setIsDataLoading(true)
  //   try {
  //     const filteredData = myData.near_earth_objects.filter((object) => object.close_approach_data[0].orbiting_body === orbitalBody)
       
  //     // push NEOs from the source
  //      filteredData.near_earth_objects.map(object => {
  //       // push object name and KM esitmated diameter
  //       generateChartData.push([object.name, object.estimated_diameter.kilometers.estimated_diameter_min, object.estimated_diameter.kilometers.estimated_diameter_max])
        
  //       // sort the data by average of min and max estimated diameter by compare first and second element
  //       generateChartData = generateChartData.sort((firstObject, secondObject) => {
  //         const avgA = (firstObject[1] + firstObject[2]) / 2
  //         const avgB = (secondObject[1] + secondObject[2]) / 2
  //         return avgB - avgA
  //       })
  //     })
  //     setChartData
  //   } catch (error) {
      
  //   }
  //   setIsDataLoading(false)
  // }

  useEffect(()=> {
    getNeoData()
  }, [])
  

  // different options for the chart
  const chartOprions = {
    chartArea: { width: "50%" },
    hAxis: {
      title: "Min Estimated Diameter (KM)",
      minValue: 0
    },
    vAxis: {
      title: "NEO names"
    }
  }

  return (
    <div className='container w-7/12 mx-auto mt-1'>
      {error.hasError && (
        <div className='p-4 bg-red-300 text-red-950 rounded-lg'>Error: {error.message}</div>
      )}
      {!error.hasError && isDataLoading && <div className='p-4'>Loading ...</div>}

      <div className='mb-2'>
        Orbital Body
      </div>
      <Select onValueChange={getNeoData}>
        <SelectTrigger className='w-[200px]'>
          <SelectValue placeholder='Choose Orbital Body' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='None'>None</SelectItem>
          <SelectItem value='Earth'>Earth</SelectItem>
          <SelectItem value='Merc'>Merc</SelectItem>
          <SelectItem value='Mars'>Mars</SelectItem>
          <SelectItem value='Venus'>Venus</SelectItem>
          <SelectItem value='Juptr'>Juptr</SelectItem>
        </SelectContent>
      </Select>

      {/* non-stacked chart */}
      {!error.hasError && !isDataLoading && chartData.length > 1 && (
        <div>
          <Chart
            chartType='BarChart'
            width='100%'
            height='600px'
            data={chartData}
            options={chartOprions}
          />
        </div>
      )}

      { chartData && chartData.length <= 1 && <div className='text-orange-500 flex justify-center items-center mt-16 text-3xl'>
        There is no data to show.
        </div>
      }
    </div>
  )
}
