function banaLint(str, replacer) {
  let dict = {
    '`': '@',
    '~': '^',
    '|': '\\',
    '{': '[',
    '}': ']',
    /*'“': '"',
    '”': '"',
    '‘': "'",
    '’': "'",*/
  };
  return str.replace(
    /(?<newline>\r\n?|\n)|(?<control>[\t\f\v])|(?<space>\s)|(?<doubleBana>[`{-~])|(?<ascii>[ -~])|./gs,
    (c, ...args) => {
      const { newline, control, space, doubleBana, ascii } =
        args[args.length - 1];
      if (newline) {
        return '\n';
      } else if (control) {
        return c;
      } else if (space) {
        return ' ';
      } else if (doubleBana) {
        return dict[c];
      } else if (ascii) {
        return c.toLowerCase();
      } else {
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
            return c;
        }
      }
    },
  );
}

const banaOrder =
  ' a1b\'k2l@cif/msp"e3h9O6r^djg>ntq,*5<-u8v.%[$+x!&;:4\\0z7(_?w]#y)=';

function banaToUnicode(str, replacer) {
  return str.replace(
    /(?<lintable>\r\n?|\s|[ -~])|(?<nonUniBraille>[^⠀-⠿])/gs,
    (c, ...args) => {
      const { nonUniBraille, lintable } = args[args.length - 1];
      if (lintable) {
        const lintC = banaLint(c);
        const idx = banaOrder.indexOf(lintC);
        return idx >= 0 ? String.fromCharCode(0x2800 + idx) : c;
      } else
        return banaLint(c, replacer === true ? '\u2800' : (replacer ?? false));
    },
  );
}

function unicodeToBana(str, replacer) {
  return str.replace(
    /(?<uniBraille>[⠀-⠿])|(?<lintable>\r\n?|\s|[ -~])|./gs,
    (c, ...args) => {
      const { uniBraille, lintable, ascii } = args[args.length - 1];
      if (uniBraille) {
        return banaOrder[c.charCodeAt() - 0x2800];
      } else {
        return banaLint(c, lintable ? undefined : replacer);
      }
    },
  );
}
