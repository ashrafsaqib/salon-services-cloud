import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Service } from "@/types"
import React from "react"

interface BookButtonProps {
  service?: Service
  category?: string
  onBook?: (service?: Service) => void
  children?: React.ReactNode
  className?: string
}

export function BookButton({ service, category, onBook, children, className }: BookButtonProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (onBook) {
      onBook(service)
    } else if (service && service.slug && category) {
      router.push(`/book?service=${encodeURIComponent(service.slug)}&category=${encodeURIComponent(category)}`)
    } else {
      // fallback: just go to /book
      router.push("/book")
    }
  }


  return (
    <Button className={className} onClick={handleClick}>
      {children || "Book Now"}
    </Button>
  )
}
