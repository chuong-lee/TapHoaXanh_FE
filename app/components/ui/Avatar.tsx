import { type ImgHTMLAttributes } from "react"

type AvatarProps = {
  src?: string
  alt?: string
  fallback?: string
  size?: number
  className?: string
} & ImgHTMLAttributes<HTMLImageElement>

const Avatar = ({
  src,
  alt,
  fallback = "?",
  size = 40,
  className = "",
  ...rest
}: AvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
        className={className}
        {...rest}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#ccc",
        color: "#fff",
        fontWeight: "600",
        fontSize: size / 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        userSelect: "none",
      }}
      className={className}
      {...rest}
    >
      {fallback}
    </div>
  )
}

export default Avatar
