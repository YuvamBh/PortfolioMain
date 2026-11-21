"use client"

// DynamicFrameLayout (from 21st.dev), copied into components/ui. Local additions are marked "Added":
// a frame may show an `image` instead of a `video`, carry `content` laid over the media, and leave the
// frame art (corner / edges) out; `onHoverChange` reports the hovered frame; `defaultHovered` keeps one frame
// enlarged while nothing is hovered. Behaviour is otherwise as given.

import { useState, useEffect, useRef, type ReactNode, type FocusEvent } from "react"
import { motion } from "framer-motion"

export interface Frame {
  id: number
  video?: string // Added: optional, since a frame can show an image instead
  image?: string // Added
  content?: ReactNode // Added: laid over the media (receives no props; read hover state from `isHovered`)
  defaultPos: { x: number; y: number; w: number; h: number }
  corner?: string // Added: optional (only used when showFrames is on)
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize: number
  borderThickness?: number
  borderSize?: number
  isHovered: boolean
}

interface FrameComponentProps {
  video?: string
  image?: string
  content?: ReactNode
  width: number | string
  height: number | string
  className?: string
  corner?: string
  edgeHorizontal?: string
  edgeVertical?: string
  mediaSize: number
  borderThickness: number
  borderSize: number
  showFrame: boolean
  isHovered: boolean
}

function FrameComponent({
  video,
  image,
  content,
  width,
  height,
  className = "",
  corner,
  edgeHorizontal,
  edgeVertical,
  mediaSize,
  borderThickness,
  borderSize,
  showFrame,
  isHovered,
}: FrameComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isHovered) {
      videoRef.current?.play().catch(() => {})
    } else {
      videoRef.current?.pause()
    }
  }, [isHovered])

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
            padding: showFrame ? `${borderThickness}px` : "0",
            width: showFrame ? `${borderSize}%` : "100%",
            height: showFrame ? `${borderSize}%` : "100%",
            left: showFrame ? `${(100 - borderSize) / 2}%` : "0",
            top: showFrame ? `${(100 - borderSize) / 2}%` : "0",
          }}
        >
          <div
            className="w-full h-full overflow-hidden"
            style={{
              transform: `scale(${mediaSize})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {video ? (
              <video
                className="w-full h-full object-cover"
                src={video}
                loop
                muted
                playsInline
                ref={videoRef}
              />
            ) : image ? (
              // Added: still image instead of a video
              <img className="w-full h-full object-cover object-top" src={image} alt="" loading="lazy" decoding="async" />
            ) : null}
          </div>
        </div>

        {/* Added: content laid over the media */}
        {content && (
          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {content}
          </div>
        )}

        {showFrame && corner && edgeHorizontal && edgeVertical && (
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            <div
              className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})` }}
            />
            <div
              className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleX(-1)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scaleY(-1)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${corner})`, transform: "scale(-1, -1)" }}
            />

            <div
              className="absolute top-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
              }}
            />
            <div
              className="absolute bottom-0 left-16 right-16 h-16"
              style={{
                backgroundImage: `url(${edgeHorizontal})`,
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
                transform: "rotate(180deg)",
              }}
            />
            <div
              className="absolute left-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
              }}
            />
            <div
              className="absolute right-0 top-16 bottom-16 w-16"
              style={{
                backgroundImage: `url(${edgeVertical})`,
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
                transform: "scaleX(-1)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface DynamicFrameLayoutProps {
  frames: Frame[]
  className?: string
  frameClassName?: string // Added: class for each frame cell
  showFrames?: boolean
  hoverSize?: number
  gapSize?: number
  onHoverChange?: (frame: Frame | null) => void // Added
  defaultHovered?: { row: number; col: number } // Added: the frame enlarged at rest (none if left out)
}

export function DynamicFrameLayout({
  frames,
  className,
  frameClassName = "",
  showFrames = false,
  hoverSize = 6,
  gapSize = 4,
  onHoverChange,
  defaultHovered,
}: DynamicFrameLayoutProps) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(defaultHovered ?? null)
  // Added: the grid collapses only when the pointer leaves the whole grid (not when it crosses a gap), and
  // moving to another frame switches after a short pause, so frames sliding under a still pointer while the
  // grid resizes don't steal the hover.
  const switchTimer = useRef<number | undefined>(undefined)
  const pending = useRef<string | null>(null)
  const enter = (frame: Frame, row: number, col: number) => {
    const key = `${row}-${col}`
    if (hovered?.row === row && hovered?.col === col) { window.clearTimeout(switchTimer.current); pending.current = null; return }
    if (pending.current === key) return
    window.clearTimeout(switchTimer.current)
    pending.current = key
    const apply = () => { pending.current = null; setHovered({ row, col }); onHoverChange?.(frame) }
    if (hovered === null) apply()
    else switchTimer.current = window.setTimeout(apply, 140)
  }
  const leaveGrid = () => {
    window.clearTimeout(switchTimer.current); pending.current = null
    setHovered(defaultHovered ?? null)
    const rest = defaultHovered && frames.find((f) => Math.floor(f.defaultPos.y / 4) === defaultHovered.row && Math.floor(f.defaultPos.x / 4) === defaultHovered.col)
    onHoverChange?.(rest ?? null)
  }
  const blurGrid = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null) && !e.currentTarget.matches(":hover")) leaveGrid()
  }
  useEffect(() => () => window.clearTimeout(switchTimer.current), [])

  const getRowSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { row } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const { col } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right"
    return `${vertical} ${horizontal}`
  }

  return (
    <div
      className={`relative w-full h-full ${className ?? ""}`}
      style={{
        display: "grid",
        gridTemplateRows: getRowSizes(),
        gridTemplateColumns: getColSizes(),
        gap: `${gapSize}px`,
        transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
      }}
      onMouseLeave={leaveGrid}
      onBlurCapture={blurGrid}
    >
      {frames.map((frame) => {
        const row = Math.floor(frame.defaultPos.y / 4)
        const col = Math.floor(frame.defaultPos.x / 4)
        const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y)
        const isHovered = hovered?.row === row && hovered?.col === col

        return (
          <motion.div
            key={frame.id}
            className={`relative ${frameClassName}`}
            style={{
              transformOrigin,
              transition: "transform 0.4s ease",
              gridRow: row + 1, // Added: place each frame by its position, whatever the array order
              gridColumn: col + 1,
            }}
            onMouseEnter={() => enter(frame, row, col)}
            onMouseMove={() => enter(frame, row, col)}
            onFocusCapture={() => { window.clearTimeout(switchTimer.current); pending.current = null; setHovered({ row, col }); onHoverChange?.(frame) }}
            data-hovered={isHovered ? "" : undefined}
          >
            <FrameComponent
              video={frame.video}
              image={frame.image}
              content={frame.content}
              width="100%"
              height="100%"
              className="absolute inset-0"
              corner={frame.corner}
              edgeHorizontal={frame.edgeHorizontal}
              edgeVertical={frame.edgeVertical}
              mediaSize={frame.mediaSize}
              borderThickness={frame.borderThickness ?? 0}
              borderSize={frame.borderSize ?? 100}
              showFrame={showFrames}
              isHovered={isHovered}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
