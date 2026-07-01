export function getInitials(firstName, lastName) {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase();
}

export default function UserAvatar({ user, size = 32, disabled }) {
  return (
    <div
      className='inline-flex items-center justify-center rounded-full font-medium text-white border border-white flex-shrink-0'
      style={{
        width: size,
        height: size,
        backgroundColor: disabled ? '#c7c7c7' : user.avatarColor,
        filter: disabled ? 'grayscale(100%)' : 'none',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <span
        style={{
          fontSize: 12,
          letterSpacing: '0.05em',
          opacity: disabled ? 0.8 : 1,
        }}
      >
        {getInitials(user.firstName, user.lastName)}
      </span>
    </div>
  );
}
