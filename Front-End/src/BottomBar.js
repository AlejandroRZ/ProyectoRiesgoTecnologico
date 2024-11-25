import React from 'react';
import './BottomBar.css'; 

// Definición del componente funcional `BottomBar`, que recibe `isTopBar` como prop.
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
