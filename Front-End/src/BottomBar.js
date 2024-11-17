import React from 'react';
import './BottomBar.css'; // Asegúrate de que los estilos están bien importados

function BottomBar({ isTopBar }) {
  return (
    <div className={isTopBar ? 'TopBar' : 'BottomBar'}>
      <div className="Content">
        <span>© 2024 MerkaditaFC</span>
        <img src="merkaditaFC.png" alt="merkaditaFC Logo" />
      </div>
    </div>
  );
}

export default BottomBar;
