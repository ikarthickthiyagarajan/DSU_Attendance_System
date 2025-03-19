import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import AttendanceCalendar from "@/components/attendance-calendar"

export const metadata: Metadata = {
  title: "DSU Attendance Calendar",
  description: "Attendance calendar for Dhanalakshmi Srinivasan University",
}

export default function AttendancePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Calendar</h1>
          <p className="text-muted-foreground">View and track attendance by date</p>
        </div>
        <AttendanceCalendar />
      </div>
    </DashboardLayout>
  )
}

