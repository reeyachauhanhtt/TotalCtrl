export default function ProgressBar({ value = 0, fullWidth = false }) {
  return (
    <div
      className='relative rounded-full overflow-hidden'
      style={{
        width: fullWidth ? '100%' : '74%',
        height: 3,
        backgroundColor: '#D9D9D9',
      }}
    >
      <div
        className='absolute top-0 left-0 h-full rounded-full transition-all'
        style={{ width: `${value}%`, backgroundColor: '#66C888' }}
      />
    </div>
  );
}
