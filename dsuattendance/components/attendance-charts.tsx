"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "./attendance-overview"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { motion } from "framer-motion"

export default function AttendanceCharts({ students }: { students: Student[] }) {
  // Ensure students is an array
  const safeStudents = Array.isArray(students) ? students : []

  // Calculate attendance distribution
  const attendanceRanges = [
    { name: "Below 75%", count: 0, color: "hsl(var(--chart-3))" },
    { name: "75% - 85%", count: 0, color: "hsl(var(--chart-5))" },
    { name: "85% - 95%", count: 0, color: "hsl(var(--chart-2))" },
    { name: "Above 95%", count: 0, color: "hsl(var(--chart-4))" },
  ]

  safeStudents.forEach((student) => {
    const percentage = student["Attendance Percentage"] || 0
    if (percentage < 75) {
      attendanceRanges[0].count++
    } else if (percentage < 85) {
      attendanceRanges[1].count++
    } else if (percentage < 95) {
      attendanceRanges[2].count++
    } else {
      attendanceRanges[3].count++
    }
  })

  // Get top 10 students by attendance
  const topStudents = [...safeStudents]
    .sort((a, b) => (b["Attendance Percentage"] || 0) - (a["Attendance Percentage"] || 0))
    .slice(0, 10)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="glassmorphism border-0 gradient-border h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text">Attendance Distribution</CardTitle>
            <CardDescription>Distribution of students by attendance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <Pie
                    data={attendanceRanges}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    filter="url(#glow)"
                    animationDuration={1500}
                    animationBegin={300}
                  >
                    {attendanceRanges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} students`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="glassmorphism border-0 gradient-border h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text">Top 10 Students</CardTitle>
            <CardDescription>Students with highest attendance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topStudents.map((student) => ({
                    name: student["Full Name"].split(" ")[0],
                    attendance: student["Attendance Percentage"],
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fill: "hsl(var(--foreground))" }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                  <Bar
                    dataKey="attendance"
                    fill="url(#barGradient)"
                    radius={[0, 4, 4, 0]}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

