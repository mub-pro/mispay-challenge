import NeoService from '@/services/neoService'
import React from 'react'
import { useEffect, useState } from 'react' 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import myData from '../../public/browse.json'
import ChartView from '@/components/chartView'
import TableView from '@/components/tableView'

export default function Home() {
  const [chartData, setChartData] = useState([])
  const [neoData, setNeoData] = useState([])

  // handle view state (chart, table)
  const [view, setView] = useState('chart')

  // handle various states of data fetching
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [error, setError] = useState({ hasError: false, message: '' })


  async function getNeoData(orbitalBody) {
    setIsDataLoading(true)

    orbitalBody = orbitalBody === 'None' ? null : orbitalBody

    try {
      // first get data from the source (api, json, etc...)
      
      const filteredData = myData.near_earth_objects.filter(object => 
        orbitalBody ? object.close_approach_data[0].orbiting_body === orbitalBody : true)
      
        console.log('filtered', filteredData)
        
      setNeoData(filteredData)
      
      // then generate chart data from the source 
      generateChartData(myData, orbitalBody)
    } catch (error) {
      setError({ hasError: true, message: error.response?.data?.error?.code || error.message })
      console.log(error)
    }

    setIsDataLoading(false)
  }

  // sepereate genearet chart data
  function generateChartData (neoData, orbitalBody) {
    var data = []

    // push NEOs from the source
    neoData.near_earth_objects.map(object => {
      if (orbitalBody && object.close_approach_data[0].orbiting_body !== orbitalBody) return
      // push object name and KM esitmated diameter
      data.push([object.name, object.estimated_diameter.kilometers.estimated_diameter_min, object.estimated_diameter.kilometers.estimated_diameter_max])
      
      // sort the data by average of min and max estimated diameter by compare first and second element
      data = data.sort((firstObject, secondObject) => {
        const avgA = (firstObject[1] + firstObject[2]) / 2
        const avgB = (secondObject[1] + secondObject[2]) / 2
        return avgB - avgA
      })
    })
    
    // finally push the chart title at first index, because this is how to dealing with chart data in the library
    data.unshift(["NEO Name", "Min Estimated Diameter", "Max Estimated Diameter"])

    setChartData(data)
  }

  useEffect(()=> {
    getNeoData()
  }, [])
  
  // handle error and loading states
  if (error.hasError) return <div className='container w-7/12 mx-auto mt-1 mb-16 p-4 bg-red-300 text-red-950 rounded-lg'>
    Error: {error.message}</div>
  
  if (isDataLoading) return <div className='container w-7/12 mx-auto mt-1 mb-16 p-4'>Loading ...</div>

  return (
    <div className='container w-7/12 mx-auto mt-1 mb-16'>
      
      {/* selects */}
      <div className='flex gap-6'>
        {/* orbital body select */}
        <div>
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
        </div>

        {/* view select */}
        <div>
          <div className='mb-2'>
            View
          </div>
          <Select onValueChange={(value) => setView(value)} defaultValue={view}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Choose a view' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='chart'>Chart</SelectItem>
              <SelectItem value='table'>Table</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {
        view === 'chart' ? (<ChartView data={chartData} />) : (<TableView data={neoData} />)
      }

      {!neoData.length && <div className='text-orange-500 flex justify-center items-center mt-16 text-3xl'>
        There is no data to show.
        </div>
      }
    </div>
  )
}