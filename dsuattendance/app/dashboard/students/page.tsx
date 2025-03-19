import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import StudentList from "@/components/student-list"

export const metadata: Metadata = {
  title: "DSU Students",
  description: "Student management for Dhanalakshmi Srinivasan University",
}

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">View and manage student information</p>
        </div>
        <StudentList />
      </div>
    </DashboardLayout>
  )
}

