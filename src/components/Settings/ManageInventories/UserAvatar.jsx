export function getInitials(firstName, lastName) {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase();
}

export default function UserAvatar({ user, size = 32 }) {
  return (
    <div
      className='inline-flex items-center justify-center rounded-full font-semibold text-white border border-white flex-shrink-0'
      style={{
        width: size,
        height: size,
        backgroundColor: user.avatarColor,
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <span style={{ fontSize: 10, letterSpacing: '0.05em' }}>
        {getInitials(user.firstName, user.lastName)}
      </span>
    </div>
  );
}
