import React, { useRef, useEffect, useState } from 'react'
import './index.css'

interface ScrollableProps {
  children: React.ReactNode
  className?: string
}

export const Scrollable: React.FC<ScrollableProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const timeoutId = useRef<number | undefined>(undefined)

  const [scrollActive, setScrollActive] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStartY = useRef(0)
  const thumbStartTop = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    const thumb = thumbRef.current
    if (!container || !content || !thumb) return

    const updateThumb = () => {
      const heightRatio = content.clientHeight / content.scrollHeight
      thumb.style.height = `${Math.max(heightRatio * container.clientHeight, 20)}px`
      const scrollRatio = content.scrollTop / (content.scrollHeight - content.clientHeight)
      thumb.style.top = `${scrollRatio * (container.clientHeight - thumb.clientHeight)}px`
    }

    const showScroll = () => {
      setScrollActive(true)
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = window.setTimeout(() => setScrollActive(false), 2000)
      updateThumb()
    }

    const onThumbMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      setDragging(true)
      dragStartY.current = e.clientY
      thumbStartTop.current = thumb.offsetTop
      document.body.style.userSelect = 'none'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return

      const deltaY = e.clientY - dragStartY.current

      const speedFactor = 1.5
      const newTop = Math.min(
        Math.max(thumbStartTop.current + deltaY * speedFactor, 0),
        container.clientHeight - thumb.clientHeight
      )

      thumb.style.top = `${newTop}px`

      // синхронизация с контентом
      const scrollRatio = newTop / (container.clientHeight - thumb.clientHeight)
      content.scrollTop = scrollRatio * (content.scrollHeight - content.clientHeight)
    }

    const onMouseUp = () => {
      if (dragging) setDragging(false)
      document.body.style.userSelect = ''
    }

    // События
    content.addEventListener('scroll', showScroll)
    container.addEventListener('mousemove', showScroll)
    thumb.addEventListener('mousedown', onThumbMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('resize', updateThumb)

    updateThumb()

    return () => {
      content.removeEventListener('scroll', showScroll)
      container.removeEventListener('mousemove', showScroll)
      thumb.removeEventListener('mousedown', onThumbMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', updateThumb)
      if (timeoutId.current) clearTimeout(timeoutId.current)
    }
  }, [dragging])

  return (
    <div
      ref={containerRef}
      className={`scrollable ${scrollActive ? 'scroll-active' : ''} ${className || ''}`}
    >
      <div ref={contentRef} className="content">
        {children}
      </div>
      <div ref={thumbRef} className="scroll-thumb" />
    </div>
  )
}
