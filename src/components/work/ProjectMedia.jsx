import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

export default function ProjectMedia({ project, className = 'aspect-[16/9]', loading = 'lazy' }) {
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [failed, setFailed] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const reduceMotion = useReducedMotion()
  const frameClass = `relative ${className} overflow-hidden bg-base`

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !project.video || reduceMotion) return

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, { rootMargin: '120px' })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [project.video, reduceMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!inView || reduceMotion || failed || userPaused) {
      video.pause()
      return
    }
    video.play().catch(() => {})
  }, [inView, reduceMotion, failed, userPaused])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      setUserPaused(false)
      video.play().catch(() => setUserPaused(true))
    } else {
      setUserPaused(true)
      video.pause()
    }
  }

  if (project.video && !failed) {
    return (
      <div ref={frameRef} className={frameClass}>
        <img src={project.image} alt={project.imageAlt} width="1600" height="900" loading={loading} decoding="async" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none" />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-300 group-hover:scale-[1.01] motion-reduce:transition-none ${inView && !reduceMotion ? 'opacity-100' : 'opacity-0'}`}
          autoPlay={inView && !reduceMotion}
          muted
          loop
          playsInline
          preload="none"
          poster={project.image}
          aria-hidden="true"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setFailed(true)}
        >
          {inView && !reduceMotion && <source src={project.video} type="video/webm" />}
        </video>
        {!reduceMotion && <button type="button" onClick={togglePlayback} aria-label={`${isPlaying ? 'Pause' : 'Play'} ${project.name} preview`} className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-base/90 px-3 text-sm font-semibold text-ink shadow-lg backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          {isPlaying ? <Pause aria-hidden className="h-4 w-4" /> : <Play aria-hidden className="h-4 w-4" />}
          <span className="sr-only">{isPlaying ? 'Pause preview' : 'Play preview'}</span>
        </button>}
        {reduceMotion && <span className="absolute bottom-3 right-3 rounded-full border border-line bg-base/90 px-3 py-2 text-xs font-medium text-ink">Still preview · motion reduced</span>}
      </div>
    )
  }

  return (
    <Link to={`/work/${project.slug}`} aria-label={`View ${project.name} case study`} className={`block ${frameClass} focus-visible:outline-offset-[-3px]`}>
      <img src={project.image} alt={project.imageAlt} width="1600" height="900" loading={loading} decoding="async" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none" />
    </Link>
  )
}
