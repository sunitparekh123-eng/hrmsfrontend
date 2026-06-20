export const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
export const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function _convertHundreds(n: number): string {
  let result = '';
  const hundreds = Math.floor(n / 100);
  if (hundreds > 0) {
    result += `${ONES[hundreds]} Hundred `;
    n %= 100;
  }
  if (n > 0 && n < 20) {
    result += `${ONES[n]} `;
  } else if (n >= 20) {
    const tens = Math.floor(n / 10);
    result += `${TENS[tens]} `;
    const ones = n % 10;
    if (ones > 0) {
      result += `${ONES[ones]} `;
    }
  }
  return result;
}

export function amountToWords(amount: number): string {
  if (amount === 0) return 'Zero';
  if (amount < 0) return `Minus ${amountToWords(Math.abs(amount))}`;

  let result = '';
  let n = Math.floor(Math.abs(amount));

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  if (crore > 0) {
    result += `${_convertHundreds(crore)}Crore `;
  }

  const lakh = Math.floor(n / 100000);
  n %= 100000;
  if (lakh > 0) {
    result += `${_convertHundreds(lakh)}Lakh `;
  }

  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (thousand > 0) {
    result += `${_convertHundreds(thousand)}Thousand `;
  }

  if (n > 0) {
    result += _convertHundreds(n);
  }

  return result.trim();
}

export function salaryToWords(amount: number): string {
  const integerPart = Math.floor(Math.abs(amount));
  return `${amountToWords(integerPart)} Only`.replace(/\s+/g, ' ').trim();
}
