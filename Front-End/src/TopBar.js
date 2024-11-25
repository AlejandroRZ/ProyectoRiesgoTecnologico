import React from 'react';
import './TopBar.css';

// Componente TopBar.
// Representa una barra superior que muestra contenido estático, como imágenes o iconos.
function TopBar() {
  return (
    <div className="TopBar">
      <div className="Content">
        <img src="MMT.png" alt="M" />
        <img src="blankuser.png" alt="M" />
      </div>
    </div>
  );
}

export default TopBar;