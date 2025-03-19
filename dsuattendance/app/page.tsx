import { Suspense } from "react"
import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 futuristic-bg grid-bg">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold neon-text">DSU Attendance Management</h1>
          <p className="mt-2 text-muted-foreground">Dhanalakshmi Srinivasan University</p>
        </div>
        <Suspense fallback={<div className="p-4 text-center">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

