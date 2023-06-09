import { get } from 'lodash-es';
import { kanji2number } from '@geolonia/japanese-numeral';

const SHORT_SCALES = {
  thousand: 1000,
  K: 1000,
  million: 1_000_000,
  M: 1_000_000,
  billion: 1_000_000_000,
  B: 1_000_000_000,
  trillion: 1_000_000_000_000,
  quadrillion: 1_000_000_000_000_000,
};

type ConvertRateResult = [boolean, string];

export const convertRate = async (
  text?: string
): Promise<ConvertRateResult> => {
  if (!text) {
    return [false, '0円'];
  }
  const item = await chrome.storage.local.get('currentRate');
  const numberFormat = new Intl.NumberFormat('ja-JP', {
    notation: 'compact',
    maximumFractionDigits: 2,
    maximumSignificantDigits: 2,
  });
  if (/[約ドル百千万億兆京]/.test(text)) {
    const currency = text.replace(/約|ドル|,/g, '');
    let yen = 0;
    // 1以下の小数点を渡せないので処理する
    if (parseFloat(currency) < 1) {
      yen = parseFloat(currency) * item.currentRate;
    } else {
      try {
        yen = kanji2number(currency) * item.currentRate;
      } catch (e) {
        console.log(`convert failed ${currency} ${text}`);
        return [false, '0円'];
      }
    }
    return [true, `約${numberFormat.format(yen)}円`];
  } else {
    const texts = text.trim().replace('$', '').split(/\s/);
    let yen = 0;
    let scales = 1;
    if (texts[1]) {
      let scaleStr = texts[1].toLowerCase();
      scaleStr = scaleStr.replace(/[.:;,]$/, '');
      scales = get(SHORT_SCALES, scaleStr) ?? 1;
    }
    const value = texts[0].replaceAll(/[:;,]/g, '');
    const unitStr = value.replace(/[0-9.]/g, '');
    if (unitStr) {
      scales = get(SHORT_SCALES, unitStr) ?? 1;
    }
    yen = parseFloat(value) * scales * item.currentRate;

    if (isNaN(yen)) {
      return [false, '0円'];
    }
    return [true, `約${numberFormat.format(yen)}円`];
  }
};
