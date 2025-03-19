import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import AttendanceOverview from "@/components/attendance-overview"

export const metadata: Metadata = {
  title: "DSU Attendance Dashboard",
  description: "Attendance management system for Dhanalakshmi Srinivasan University",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Attendance management system for Dhanalakshmi Srinivasan University</p>
        </div>
        <AttendanceOverview />
      </div>
    </DashboardLayout>
  )
}

