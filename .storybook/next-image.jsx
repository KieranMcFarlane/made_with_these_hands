export default function Image({
  alt = '',
  fill = false,
  height,
  priority: _priority,
  sizes: _sizes,
  src,
  width,
  ...props
}) {
  const resolvedSrc = typeof src === 'string' ? src : src?.src;
  const style = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...(props.style || {}),
      }
    : props.style;

  return (
    <img
      {...props}
      alt={alt}
      height={fill ? undefined : height}
      src={resolvedSrc}
      style={style}
      width={fill ? undefined : width}
    />
  );
}
