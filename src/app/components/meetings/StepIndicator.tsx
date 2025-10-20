"use client"

import { motion } from "framer-motion"

interface StepIndicatorProps {
  current: number
  steps: string[]
}

export function StepIndicator({ current, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-6 mt-2 mb-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isActive = current === stepNumber
        const isCompleted = stepNumber < current

        return (
          <div key={label} className="flex items-center gap-3">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-md scale-110"
                  : isCompleted
                  ? "border-indigo-300 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:border-indigo-700"
                  : "border-gray-300 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:border-gray-700"
              }`}
            >
              {stepNumber}
            </motion.div>
            <span
              className={`text-sm transition-colors ${
                isActive
                  ? "text-indigo-600 font-semibold"
                  : isCompleted
                  ? "text-muted-foreground line-through"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {index !== steps.length - 1 && (
              <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700" />
            )}
          </div>
        )
      })}
    </div>
  )
}
