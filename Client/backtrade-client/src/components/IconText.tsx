import React from 'react';
import { FcNext } from 'react-icons/fc';
import './IconText.css';

interface IconTextProps {
  text: string;
  iconSize?: string;
  textSize?: string;
}

const IconText: React.FC<IconTextProps> = ({ text, iconSize = '24px', textSize = '16px' }) => {
  return (
    <div className="iconTextContainer">
      <FcNext className="icon" style={{ fontSize: iconSize }} />
      <span className="text" style={{ fontSize: textSize }}>{text}</span>
    </div>
  );
};

export default IconText;
