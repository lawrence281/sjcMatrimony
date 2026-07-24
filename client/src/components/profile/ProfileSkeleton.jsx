export default function ProfileSkeleton() {
  return (
    <div className="profile-skeleton">
      {/* Header skeleton */}
      <div className="skel-card">
        <div className="skel-cover" />
        <div className="skel-header-body">
          <div className="skel-avatar" />
          <div className="skel-info">
            <div className="skel-line wide" />
            <div className="skel-line medium" />
            <div className="skel-line narrow" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="profile-skeleton-grid">
        <div className="skel-sidebar">
          <div className="skel-card skel-completion">
            <div className="skel-line medium" />
            <div className="skel-circle" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skel-row">
                <div className="skel-dot" />
                <div className="skel-line flex-1" />
                <div className="skel-bar" />
              </div>
            ))}
          </div>
        </div>
        <div className="skel-main">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skel-card skel-section">
              <div className="skel-section-header">
                <div className="skel-line medium" />
                <div className="skel-chip" />
              </div>
              <div className="skel-grid-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="skel-field">
                    <div className="skel-line narrow" />
                    <div className="skel-input" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
