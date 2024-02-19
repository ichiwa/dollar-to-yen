import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelectionText } from '../../hooks/useSelectionText';

function isNumber(s: string): boolean {
  return /^-?\d{1,3}(,\d{3})*(\.\d+)?$/.test(s.replace(/\s/g, ''));
}

const calculateAbbreviation = (valueString: string, abbreviation: string) => {
  // Convert the valueString to a number
  const value = parseFloat(valueString.replace(/,/g, ''));

  // Define the multiplication factors for each abbreviation
  const factors = {
    thousand: 1000,
    million: 1000000,
    billion: 1000000000,
  };

  // Get the factor based on the abbreviation
  const factor = factors[abbreviation];

  // Check if the abbreviation is valid
  if (!factor) {
    return valueString;
  }

  // Multiply the value by the factor and convert it back to a string
  const result = value * factor;

  // Return the result as a string
  return result.toString();
};

const iconSrc = chrome.runtime.getURL('icon-34.png');

export const Tooltip = () => {
  const { selection, calculateJpy, jpy } = useSelectionText();
  const [showYen, setShowYen] = useState(false);
  const [, setAbbreviation] = useState('');
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClickConvertIcon = useCallback((event) => {
    event.stopPropagation();
    setShowYen(true);
  }, []);

  const handleChangeAbbreviation = useCallback(
    (event) => {
      setAbbreviation(event.target.value);
      const newValue = calculateAbbreviation(
        selection.toString(),
        event.target.value
      );
      calculateJpy(newValue);
    },
    [calculateJpy, selection]
  );

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
  const lineHeight = 26;
  const offset = lineHeight + 10;
  const isNumberOnly = isNumber(selection.toString());

  if (!showYen) {
    return (
      <StyledImageTip
        $left={left}
        $top={top - offset - 4}
        onClick={handleClickConvertIcon}
      >
        <StyledImg src={iconSrc} alt="app icon" />
      </StyledImageTip>
    );
  }

  return (
    <StyledTip
      $left={left}
      $top={top - offset - lineHeight}
      tooltipRef={tooltipRef}
    >
      <StyledText>
        {selection.toString()}
        {isNumberOnly && (
          <StyledSelect
            name="selectAbbreviation"
            onChange={handleChangeAbbreviation}
          >
            <option value="">数字略</option>
            <option value="thousand">千ドル</option>
            <option value="million">100万ドル</option>
            <option value="billion">10億ドル</option>
          </StyledSelect>
        )}
      </StyledText>
      <StyledText> は {jpy}</StyledText>
    </StyledTip>
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
  flex-direction: column;
  gap: 4px;
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
  border-radius: 8px;
  padding: 4px 4px;
  display: flex;
  filter: drop-shadow(4px 2px 2px #000000cc);
  cursor: pointer;
  ${(props) => props.$left && `left: ${props.$left}px;`};
  ${(props) => props.$top && `top: ${props.$top}px;`};
`;

const StyledImg = styled.img`
  width: 20px;
  height: 20px;
`;

const StyledSelect = styled.select`
  margin-left: 6px;
`;
