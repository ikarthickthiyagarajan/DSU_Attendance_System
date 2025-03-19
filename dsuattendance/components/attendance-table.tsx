"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Student } from "./attendance-overview"
import { motion, AnimatePresence } from "framer-motion"

export default function AttendanceTable({ students }: { students: Student[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  // Ensure students is an array
  const safeStudents = Array.isArray(students) ? students : []

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "ID No",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("ID No")}</div>,
    },
    {
      accessorKey: "Full Name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "Department",
      header: "Department",
    },
    {
      accessorKey: "Attendance Percentage",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Attendance %
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const percentage = Number.parseFloat(row.getValue("Attendance Percentage")) || 0
        let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default"
        let badgeClass = ""

        if (percentage < 75) {
          badgeVariant = "outline"
          badgeClass = "bg-red-500/10 text-red-500 border-red-500/20"
        } else if (percentage < 85) {
          badgeVariant = "outline"
          badgeClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        } else {
          badgeVariant = "outline"
          badgeClass = "bg-green-500/10 text-green-500 border-green-500/20"
        }

        return (
          <Badge variant={badgeVariant} className={badgeClass}>
            {percentage.toFixed(1)}%
          </Badge>
        )
      },
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("Status") as string
        return (
          <Badge
            variant="outline"
            className={
              status === "Present"
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20"
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original

        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStudent(student)}
                className="transition-all duration-300 hover:bg-primary/10"
              >
                <Eye className="mr-2 h-4 w-4" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] glassmorphism border-0 gradient-border">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold gradient-text">Student Details</DialogTitle>
              </DialogHeader>
              {selectedStudent && (
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {selectedStudent["First Name"]?.[0] || "?"}
                      {selectedStudent["Last Name"]?.[0] || "?"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedStudent["Full Name"]}</h2>
                      <p className="text-sm text-muted-foreground">{selectedStudent["ID No"]}</p>
                    </div>
                    <Badge
                      className="ml-auto"
                      variant="outline"
                      className={
                        selectedStudent.Status === "Present"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {selectedStudent.Status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                      <p>{selectedStudent["Department"]}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                      <p>{selectedStudent["Date of Birth"]}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="truncate">{selectedStudent["Email"]}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Blood Group</h3>
                      <p>{selectedStudent["Blood Group"]}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                      <p className="truncate">{selectedStudent["Address"]}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2 gradient-text">Attendance Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="glassmorphism border-0">
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">{selectedStudent["Present Days"]}</div>
                          <p className="text-xs text-muted-foreground">Present Days</p>
                        </CardContent>
                      </Card>
                      <Card className="glassmorphism border-0">
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">{selectedStudent["Total Days"]}</div>
                          <p className="text-xs text-muted-foreground">Total Days</p>
                        </CardContent>
                      </Card>
                      <Card className="glassmorphism border-0">
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {selectedStudent["Attendance Percentage"]?.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Attendance %</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  const table = useReactTable({
    data: safeStudents,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={(table.getColumn("Full Name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("Full Name")?.setFilterValue(event.target.value)}
            className="max-w-sm glassmorphism border-0 focus:ring-1 focus:ring-primary"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto glassmorphism border-0">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glassmorphism border-0">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md overflow-hidden glassmorphism border-0 gradient-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border/30 hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-border/30 transition-colors hover:bg-primary/5"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {safeStudents.length} students
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="transition-all duration-300 glassmorphism border-0 hover:bg-primary/10"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="transition-all duration-300 glassmorphism border-0 hover:bg-primary/10"
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

