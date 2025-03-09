"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@kurta-my/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-neutral-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white",
        day_selected:
          "bg-white text-neutral-900 hover:bg-white hover:text-neutral-900 focus:bg-white focus:text-neutral-900",
        day_today: "bg-neutral-800 text-white",
        day_outside: "text-neutral-400 opacity-50",
        day_disabled: "text-neutral-400 opacity-50",
        day_range_middle:
          "aria-selected:bg-neutral-800 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
