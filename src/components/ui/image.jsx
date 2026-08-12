import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * A plain <img> wrapper for locally served images (public/images/*).
 *
 * Replaces the hosted media pipeline that used to resize and re-encode images
 * on a CDN. Files in public/ are served as-is, so the component's job is now
 * layout stability and loading behaviour only:
 *
 *   - lazy loading below the fold
 *   - an optional aspect-ratio box that reserves space before the image loads,
 *     so nothing shifts on arrival
 *   - a fade-in once decoded
 *
 * `fittingType` keeps its old meaning: "fill" crops to the box (object-cover),
 * "fit" letterboxes inside it (object-contain).
 */
const Image = React.forwardRef(
  (
    {
      src,
      alt = "",
      className,
      style,
      fittingType = "fill",
      originWidth,
      originHeight,
      loading = "lazy",
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [loaded, setLoaded] = React.useState(false)
    const [failed, setFailed] = React.useState(false)

    // Reset the fade when the source changes.
    React.useEffect(() => {
      setLoaded(false)
      setFailed(false)
    }, [src])

    // Known intrinsic dimensions reserve the box before the file arrives.
    const aspectRatio =
      originWidth && originHeight ? `${originWidth} / ${originHeight}` : undefined

    if (!src || failed) {
      // No image, or the file is missing — render a neutral plate rather than
      // a broken-image icon. Call sites that care already branch on the URL.
      return (
        <span
          ref={ref}
          aria-hidden={!alt || undefined}
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          className={cn("inline-block relative bg-secondary", className)}
          style={{ aspectRatio, ...style }}
          data-empty-image={!src || undefined}
          data-error-image={failed || undefined}
        />
      )
    }

    return (
      <span
        className={cn("inline-block relative overflow-hidden", className)}
        style={{ aspectRatio, ...style }}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          width={originWidth}
          height={originHeight}
          className={cn(
            "w-full h-full inset-0 absolute transition-opacity duration-500 motion-reduce:transition-none",
            fittingType === "fit" ? "object-contain" : "object-cover",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={(e) => {
            setLoaded(true)
            onLoad?.(e)
          }}
          onError={(e) => {
            setFailed(true)
            onError?.(e)
          }}
          {...props}
        />
      </span>
    )
  }
)
Image.displayName = "Image"

export { Image }
