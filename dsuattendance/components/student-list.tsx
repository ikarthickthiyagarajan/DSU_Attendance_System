"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Student } from "./attendance-overview"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)
        // Fetch data from the provided Google Apps Script Web App
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbyrCV1w7TcM2W-UzagEtVg9DdvUMCZOn2OFcXs552fdLbkhgILZ6jjxbwpmyBGO_BSE/exec",
        )

        if (!response.ok) {
          throw new Error("Failed to fetch student data")
        }

        const data = await response.json()

        // Ensure data is an array
        if (Array.isArray(data)) {
          setStudents(data)
        } else if (data && typeof data === "object") {
          // If data is an object, check if it has any array properties
          const arrayData = Object.values(data).find((val) => Array.isArray(val))
          if (arrayData) {
            setStudents(arrayData)
          } else {
            // If no array found, convert the object to an array if possible
            const convertedData = Object.keys(data).map((key) => ({
              ...data[key],
              "ID No": key, // Use the key as ID if not present
            }))
            setStudents(convertedData)
          }
        } else {
          // If data is neither an array nor an object, set empty array
          console.error("Unexpected data format:", data)
          setStudents([])
          setError("Received data in an unexpected format.")
        }
      } catch (err) {
        console.error("Error fetching student data:", err)
        setError("Failed to load student data. Please try again later.")
        setStudents([]) // Ensure students is an array even on error
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (student) =>
          student["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student["ID No"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student["Email"]?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto text-sm text-muted-foreground">Total: {filteredStudents.length} students</div>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Blood Group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student["ID No"]}>
                    <TableCell className="font-medium">{student["ID No"]}</TableCell>
                    <TableCell>{student["Full Name"]}</TableCell>
                    <TableCell>{student["Date of Birth"]}</TableCell>
                    <TableCell>{student["Department"]}</TableCell>
                    <TableCell>{student["Email"]}</TableCell>
                    <TableCell>{student["Blood Group"]}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

