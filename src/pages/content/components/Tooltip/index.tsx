import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelectionText } from '../../hooks/useSelectionText';

const iconSrc = chrome.runtime.getURL('icon-34.png');

export const Tooltip = () => {
  const { selection, jpy } = useSelectionText();
  const [showYen, setShowYen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClickConvertIcon = useCallback((event) => {
    event.stopPropagation();
    setShowYen(true);
  }, []);

  useEffect(() => {
    if (!selection) {
      setShowYen(false);
    }
  }, [selection]);

  useEffect(() => {
    if (tooltipRef.current !== null) {
      console.log(tooltipRef.current.clientHeight);
    }
  }, []);

  if (!selection || !jpy) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const top = rect.top + window.pageYOffset;
  const left = rect.left - 2;
  const offset = 26 + 10;

  if (!showYen) {
    return (
      <StyledImageTip
        $left={left}
        $top={top - offset + 2}
        onClick={handleClickConvertIcon}
      >
        <StyledImg src={iconSrc} alt="app icon" />
      </StyledImageTip>
    );
  }

  return (
    jpy && (
      <StyledTip $left={left} $top={top - offset} tooltipRef={tooltipRef}>
        <StyledText>{jpy}</StyledText>
      </StyledTip>
    )
  );
};

const StyledTip = styled.div<{ $left: number; $top: number }>`
  z-index: 2147483647;
  position: absolute;
  background-color: #fff;
  border: 1px solid #000000cc;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  filter: drop-shadow(4px 2px 2px #000000cc);
  ${(props) => props.$left && `left: ${props.$left}px;`};
  ${(props) => props.$top && `top: ${props.$top}px;`};
`;

const StyledText = styled.span`
  white-space: nowrap;
  position: relative;
  color: #000;
`;

const StyledImageTip = styled.div<{
  $left: number;
  $top: number;
}>`
  z-index: 2147483647;
  position: absolute;
  background-color: #fff;
  border: 1px solid #000000cc;
  border-radius: 12px;
  padding: 4px 4px;
  display: flex;
  filter: drop-shadow(4px 2px 2px #000000cc);
  cursor: pointer;
  ${(props) => props.$left && `left: ${props.$left}px;`};
  ${(props) => props.$top && `top: ${props.$top}px;`};
`;

const StyledImg = styled.img`
  width: 16px;
  height: 16px;
`;
