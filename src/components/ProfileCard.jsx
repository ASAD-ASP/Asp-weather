function ProfileCard({ title, subtitle }) {
  return (
    <div className="profile-card">
      <div className="profile-avatar">⛅</div>
      <div className="profile-info">
        <div className="profile-title">{title}</div>
        <div className="profile-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}

export default ProfileCard;
