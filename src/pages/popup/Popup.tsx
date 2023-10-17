import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Popup = () => {
  const [currentRate, setCurrentRate] = useState<number>(null);
  useEffect(() => {
    const initialize = async () => {
      const item = await chrome.storage.local.get('currentRate');
      setCurrentRate(item.currentRate);
    };
    initialize();
  }, []);

  return (
    <Main>
      <CurrentRateDesc>1アメリカ合衆国ドルは</CurrentRateDesc>
      <CurrentRateText>{currentRate}円</CurrentRateText>
      <CurrentDateText>
        {new Date().toLocaleString('ja-jp', {
          dateStyle: 'long',
        })}{' '}
        現在
      </CurrentDateText>
    </Main>
  );
};

const Main = styled.main`
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
`;

const CurrentRateDesc = styled.div`
  color: #70757a;
`;

const CurrentRateText = styled.strong`
  font-size: 1.4em;
`;

const CurrentDateText = styled.div`
  font-size: 0.8em;
`;

export default Popup;
