"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="bg-[#212121] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search offers, orders..."
              className="pl-10 w-80 bg-[#414141] border-gray-700 text-white placeholder:text-gray-400 focus:border-[rgb(54,235,138)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[rgb(54,235,138)] rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
