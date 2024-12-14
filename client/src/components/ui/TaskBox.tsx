import { useState } from 'react';
import styled from 'styled-components';

const TaskBox = ({ title, id, onToggle, defaultChecked, defineMaxWidth }: { title: string; id: string; onToggle?: (checked: boolean) => void; defaultChecked: boolean; defineMaxWidth?: string }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    // Call the optional onToggle callback if provided
    if (onToggle) {
      onToggle(newCheckedState);
    }
  };
  return (
    <StyledWrapper>
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id={id}
          className="inp-cbx"
          checked={isChecked}
          onChange={handleCheckboxChange}
          style={{ display: 'none' }}
        />
        <label htmlFor={id} className="cbx">
          <span style={{ position: 'relative'}}>
            <svg viewBox="0 0 12 9" height="9px" width="12px">
              <polyline points="1 5 4 8 11 1" />
            </svg>
          </span>
          <span style={{
            position: 'relative',
            top: '1px',
            display: 'inline-block'
          }}>
            <p className={`${defineMaxWidth || "max-w-96"} line-clamp-1`}>{title}</p>
          </span>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkbox-wrapper .cbx {
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }
  .checkbox-wrapper .cbx span {
    display: inline-block;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper .cbx span:first-child {
    position: relative;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transform: scale(1);
    vertical-align: middle;
    border: 1px solid #b9b8c3;
    transition: all 0.2s ease;
  }
  .checkbox-wrapper .cbx span:first-child svg {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 6px;
    fill: none;
    stroke: white;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper .cbx span:first-child:before {
    content: "";
    width: 100%;
    height: 100%;
    background: #506eec;
    display: block;
    transform: scale(0);
    opacity: 1;
    border-radius: 50%;
    transition-delay: 0.2s;
  }
  .checkbox-wrapper .cbx span:last-child {
    margin-left: 8px;
  }
  .checkbox-wrapper .cbx span:last-child:after {
    content: "";
    position: absolute;
    top: 14px;
    left: 0;
    height: 1px;
    width: 100%;
    background: #b9b8c3;
    transform-origin: 0 0;
    transform: scaleX(0);
  }
  .checkbox-wrapper .cbx:hover span:first-child {
    border-color: #3c53c7;
  }

  .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child {
    border-color: #3c53c7;
    background: #3c53c7;
    animation: check-15 0.6s ease;
  }
  .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child svg {
    stroke-dashoffset: 0;
  }
  .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child:before {
    transform: scale(2.2);
    opacity: 0;
    transition: all 0.6s ease;
  }
  .checkbox-wrapper .inp-cbx:checked + .cbx span:last-child {
    color: #b9b8c3;
    transition: all 0.3s ease;
  }
  .checkbox-wrapper .inp-cbx:checked + .cbx span:last-child:after {
    transform: scaleX(1);
    transition: all 0.3s ease;
  }

  @keyframes check-15 {
    50% {
      transform: scale(1.2);
    }
  }`;

export default TaskBox;
