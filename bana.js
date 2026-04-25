function banaLint(str, replacer) {
  let dict = {
    '`': '@',
    '~': '^',
    '|': '\\',
    '{': '[',
    '}': ']',
    '“': '"',
    '”': '"',
    '‘': "'",
    '’': "'",
  };
  return str.replace(/\r\n?|./gis, (c) => {
    if ('\r\n'.includes(c)) {
      return '\n';
    } else if (c in dict) {
      return dict[c];
    } else {
      return c.toLowerCase();
    }
  });
}

const banaOrder =
  ' a1b\'k2l@cif/msp"e3h9O6r^djg>ntq,*5<-u8v.%[$+x!&;:4\\0z7(_?w]#y)=';

function banaToUnicode(str, replacer) {
  return banaLint(str).replace(/\r\n?|./gis, (c) => {
    // (0x2800 ~ 0x28ff)
    if (c >= '⠀' && c <= '⠿') return c;
    else if ('\r\n'.includes(c)) return '\n';

    const idx = banaOrder.indexOf(c);
    if (idx >= 0) return String.fromCharCode(0x2800 + idx);
    else {
      switch (typeof replacer) {
        case 'string':
          return replacer;
        case 'number':
          //case 'bigint':
          return String.fromCharCode(replacer);
        case 'function':
          return replacer(c);
        case 'boolean':
          // (0x2800, 0xFFFD)
          return replacer ? '⠀' : '�';
        case 'undefined':
        default:
          //throw new Error("유니코드 변환 실패")
          return c;
      }
    }
  });
}

function unicodeToBana(str, replacer) {
  return str.replace(/\r\n?|./gis, (c) => {
    const code = c.charCodeAt();
    if (code >= 0x2800 && code <= 0x28ff) return banaOrder[code - 0x2800];
    else if ('\r\n'.includes(c)) return '\n';

    const cLint = banaLint(c);
    if (banaOrder.includes(cLint)) return cLint;
    else {
      switch (typeof replacer) {
        case 'string':
          return replacer;
        case 'number':
          //case 'bigint':
          return String.fromCharCode(replacer);
        case 'function':
          return replacer(c);
        case 'boolean':
          // (space, 0xFFFD)
          return replacer ? ' ' : '�';
        case 'undefined':
        default:
          //throw new Error("유니코드 변환 실패")
          return c;
      }
    }
  });
}
