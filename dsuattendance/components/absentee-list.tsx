"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Student } from "./attendance-overview"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AbsenteeList({ students }: { students: Student[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  // Ensure students is an array
  const safeStudents = Array.isArray(students) ? students : []

  const filteredStudents = safeStudents.filter(
    (student) =>
      student["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student["ID No"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student["Department"]?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="glassmorphism border-0 gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
          <span className="text-2xl font-bold gradient-text">Absentee List</span>
        </CardTitle>
        <CardDescription>
          Students who are absent today - Real-time data ({safeStudents.length} students)
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or department..."
            className="pl-8 glassmorphism border-0 focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {safeStudents.length === 0 && (
          <Alert className="bg-yellow-500/10 border-yellow-500/20 mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription>
              No absent students found. Please refresh the data or check the connection to the attendance system.
            </AlertDescription>
          </Alert>
        )}

        {filteredStudents.length === 0 && safeStudents.length > 0 ? (
          <p className="text-center py-4 text-muted-foreground">No absent students found matching your search.</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student["ID No"]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors duration-300"
                  whileHover={{ scale: 1.01, x: 5 }}
                >
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-red-400 to-red-600 text-white">
                      {student["First Name"]?.[0] || "?"}
                      {student["Last Name"]?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{student["Full Name"] || "Unknown"}</p>
                    <div className="flex flex-wrap items-center gap-1">
                      <p className="text-xs text-muted-foreground">{student["ID No"] || "N/A"}</p>
                      <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                        {student["Department"] || "N/A"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {student["Email"] || "No email"}
                      </p>
                      <span className="text-sm text-red-500 font-medium whitespace-nowrap">
                        {student["Attendance Percentage"]?.toFixed(1) || "0"}% attendance
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

