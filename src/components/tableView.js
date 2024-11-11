import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function TableView({ data }) {
  if (data.length) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>NEO Name</TableHead>
              <TableHead>Min Estimated Diameter (KM)</TableHead>
              <TableHead>Max Estimated Diameter (KM)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((object, index) => (
              <TableRow>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell>{object.name}</TableCell>
                <TableCell>{object.estimated_diameter.kilometers.estimated_diameter_min}</TableCell>
                <TableCell>{object.estimated_diameter.kilometers.estimated_diameter_max}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}
