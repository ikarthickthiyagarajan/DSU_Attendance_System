"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Download, FileText, Mail, Printer } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Mock data for demonstration
const generateMockMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month) => ({
    name: month,
    attendance: Math.floor(Math.random() * 20) + 80, // 80-100%
  }))
}

const generateMockDepartmentData = () => {
  const departments = ["BCA", "MCA", "B.Tech", "M.Tech", "MBA"]
  return departments.map((dept) => ({
    name: dept,
    attendance: Math.floor(Math.random() * 20) + 80, // 80-100%
  }))
}

const monthlyData = generateMockMonthlyData()
const departmentData = generateMockDepartmentData()

export default function AttendanceReports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("summary")
  const [department, setDepartment] = useState("all")

  const handleGenerateReport = () => {
    // In a real application, this would generate and download a report
    alert("Report generation would be implemented here with actual data")
  }

  return (
    <Tabs defaultValue="generate">
      <TabsList className="mb-4">
        <TabsTrigger value="generate">Generate Reports</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="generate">
        <Card>
          <CardHeader>
            <CardTitle>Generate Attendance Report</CardTitle>
            <CardDescription>
              Create customized attendance reports for specific date ranges and departments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="absentee">Absentee Report</SelectItem>
                    <SelectItem value="low-attendance">Low Attendance Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="bca">BCA</SelectItem>
                    <SelectItem value="mca">MCA</SelectItem>
                    <SelectItem value="btech">B.Tech</SelectItem>
                    <SelectItem value="mtech">M.Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
            </div>

            <div className="rounded-md border p-4 bg-muted/50">
              <h3 className="font-medium mb-2">Report Preview</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {reportType === "summary" && "A summary of attendance statistics for all students."}
                {reportType === "detailed" && "Detailed attendance records for each student."}
                {reportType === "absentee" && "List of students who were absent during the selected period."}
                {reportType === "low-attendance" && "Students with attendance below 75%."}
              </p>

              <div className="text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="font-medium">Report Type:</span>
                  <span>{reportType.charAt(0).toUpperCase() + reportType.slice(1)}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="font-medium">Department:</span>
                  <span>{department === "all" ? "All Departments" : department.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="font-medium">Date Range:</span>
                  <span>
                    {dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "Start date"} -{" "}
                    {dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "End date"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
            <Button onClick={handleGenerateReport}>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trend</CardTitle>
              <CardDescription>Average attendance percentage by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance by Department</CardTitle>
              <CardDescription>Average attendance percentage by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                    <Legend />
                    <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {reportType === "summary"
                            ? "Summary Report"
                            : reportType === "detailed"
                              ? "Detailed Report"
                              : reportType === "absentee"
                                ? "Absentee Report"
                                : "Low Attendance Report"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Generated on {format(addDays(new Date(), -i * 3), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}

