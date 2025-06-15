import React from 'react';

function Header({ currentTime }) {
  const options = { hour: '2-digit', minute: '2-digit' };
  const timeStr = currentTime.toLocaleTimeString('ar-EG', options);
  const dateStr = currentTime.toLocaleDateString('ar-EG');

  return (
    <div className="header">
      <div className="date-time">
        <span>{dateStr}</span> - <span>{timeStr}</span>
      </div>
    </div>
  );
}

export default Header;
