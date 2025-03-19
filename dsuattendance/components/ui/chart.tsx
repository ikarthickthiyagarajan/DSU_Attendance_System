"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartConfig | null>(null)

function ChartContainer({ children, config, className, ...props }: ChartContainerProps) {
  // Set CSS variables for chart colors
  React.useEffect(() => {
    const root = document.documentElement
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value.color)
    })

    return () => {
      Object.keys(config).forEach((key) => {
        root.style.removeProperty(`--color-${key}`)
      })
    }
  }, [config])

  return (
    <ChartContext.Provider value={config}>
      <div className={cn("w-full h-full", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  indicator?: "line" | "dashed"
}

function ChartTooltip({ className, children, indicator = "line", ...props }: ChartTooltipProps) {
  return (
    <div className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props}>
      {children}
    </div>
  )
}

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  indicator?: "line" | "dashed"
  items: {
    name: string
    value: string | number
    color?: string
  }[]
}

function ChartTooltipContent({ className, items, indicator = "line", ...props }: ChartTooltipContentProps) {
  const config = React.useContext(ChartContext)

  return (
    <ChartTooltip className={className} indicator={indicator} {...props}>
      <div className="flex flex-col gap-1">
        {items.map((item, index) => {
          const color = item.color || (config && config[item.name]?.color)

          return (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {color && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
                <span className="text-sm text-muted-foreground">
                  {(config && config[item.name]?.label) || item.name}:
                </span>
              </div>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          )
        })}
      </div>
    </ChartTooltip>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }

