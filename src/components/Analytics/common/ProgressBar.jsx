export default function ProgressBar({ value = 0, fullWidth = false, ...rest }) {
  const minVisible = value > 0 ? Math.max(value, 3) : 0;

  return (
    <div
      className='relative rounded-full overflow-hidden'
      style={{
        width: fullWidth ? '100%' : '74%',
        height: 9,
        backgroundColor: '#D9D9D9',
      }}
    >
      <div
        className='absolute top-0 left-0 h-full rounded-full transition-all'
        style={{ width: `${minVisible}%`, backgroundColor: '#66C888' }}
      />
    </div>
  );
}
