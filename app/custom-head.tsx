// components/custom-head.tsx
"use client"

import { useEffect } from 'react'

interface CustomHeadProps {
  headTag: string
}

export default function CustomHead({ headTag }: CustomHeadProps) {
  useEffect(() => {
    if (headTag && typeof window !== 'undefined') {
      const parser = new DOMParser()
      const doc = parser.parseFromString(headTag, 'text/html')
      const head = document.head
      
      // Add each element to the head
      Array.from(doc.head.children).forEach(element => {
        head.appendChild(element.cloneNode(true))
      })
    }
  }, [headTag])

  return null
}