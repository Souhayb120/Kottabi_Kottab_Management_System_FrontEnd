const EmptyState = ({ icon, title, hint, children }) => {
  return (
    <div className="empty-state">
      {icon && <span className="empty-icon">{icon}</span>}
      {title && <div className="empty-title">{title}</div>}
      {hint && <div className="empty-hint">{hint}</div>}
      {children}
    </div>
  );
};

export default EmptyState;