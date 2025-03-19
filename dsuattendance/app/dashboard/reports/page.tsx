import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import AttendanceReports from "@/components/attendance-reports"

export const metadata: Metadata = {
  title: "DSU Attendance Reports",
  description: "Attendance reports for Dhanalakshmi Srinivasan University",
}

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and view attendance reports</p>
        </div>
        <AttendanceReports />
      </div>
    </DashboardLayout>
  )
}

