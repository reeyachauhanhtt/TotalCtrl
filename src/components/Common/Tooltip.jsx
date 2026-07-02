import { Tooltip } from 'react-tooltip';

export default function Tooltip({
  id,
  place = 'top',
  className,
  style,
  ...rest
}) {
  return (
    <Tooltip
      id={id}
      place={place}
      className={className}
      style={{
        backgroundColor: '#19191c',
        fontSize: 12,
        borderRadius: 8,
        ...style,
      }}
      {...rest}
    />
  );
}
