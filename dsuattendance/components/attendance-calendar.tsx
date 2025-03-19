"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import type { Student } from "./attendance-overview"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock attendance data for demonstration
const mockAttendanceData: Record<string, { total: number; present: number; absentees: Student[] }> = {}

// Generate mock data for the past 60 days
const generateMockData = () => {
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    // Random attendance data
    const total = 50 // Total students
    const present = Math.floor(Math.random() * 15) + 35 // Between 35-50 students present

    // Generate mock absentees
    const absentees: Student[] = []
    for (let j = 0; j < total - present; j++) {
      absentees.push({
        "First Name": `Student${j}`,
        "Last Name": `Last${j}`,
        "Full Name": `Student${j} Last${j}`,
        "Date of Birth": "01-01-2000",
        Department: "BCA",
        "ID No": `BCA${1000 + j}`,
        Address: "123 College St",
        "Blood Group": "O+",
        Email: `student${j}@college.edu`,
        "Attendance Percentage": Math.floor(Math.random() * 30) + 60, // Lower attendance for absentees
      })
    }

    mockAttendanceData[dateString] = { total, present, absentees }
  }
}

// Generate the mock data
generateMockData()

export default function AttendanceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get attendance data for the selected date
  const getAttendanceForDate = (date: Date | undefined) => {
    if (!date) return null

    const dateString = date.toISOString().split("T")[0]
    return mockAttendanceData[dateString] || null
  }

  const selectedDateData = getAttendanceForDate(selectedDate)

  // Custom day render function to show attendance indicators
  const renderDay = (day: Date) => {
    const dateString = day.toISOString().split("T")[0]
    const data = mockAttendanceData[dateString]

    if (!data) return null

    // Calculate attendance percentage for the day
    const percentage = (data.present / data.total) * 100

    let bgColor = "bg-green-500"
    if (percentage < 75) {
      bgColor = "bg-red-500"
    } else if (percentage < 90) {
      bgColor = "bg-yellow-500"
    }

    return (
      <div className="relative h-full w-full p-2">
        <div className="absolute bottom-1 right-1">
          <div className={`h-2 w-2 rounded-full ${bgColor}`} />
        </div>
        <div>{day.getDate()}</div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
          <CardDescription>Select a date to view attendance details</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              Day: ({ day, ...props }) => <button {...props}>{renderDay(day)}</button>,
            }}
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Good (≥90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>Average (75-90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Poor (&lt;75%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? <>Attendance for {selectedDate.toLocaleDateString()}</> : <>Select a date</>}
          </CardTitle>
          {selectedDateData && (
            <CardDescription>
              {selectedDateData.present} out of {selectedDateData.total} students present (
              {((selectedDateData.present / selectedDateData.total) * 100).toFixed(1)}%)
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {selectedDateData ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Card className="flex-1">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{selectedDateData.present}</div>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{selectedDateData.total - selectedDateData.present}</div>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {((selectedDateData.present / selectedDateData.total) * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Absentees ({selectedDateData.absentees.length})</h3>
                {selectedDateData.absentees.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {selectedDateData.absentees.map((student) => (
                      <div key={student["ID No"]} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {student["First Name"][0]}
                            {student["Last Name"][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{student["Full Name"]}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            ID: {student["ID No"]} | {student["Department"]}
                          </p>
                        </div>
                        <Badge variant="destructive">{student["Attendance Percentage"]}%</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No absentees for this date.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground">Select a date to view attendance details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

