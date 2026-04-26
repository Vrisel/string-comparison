function 비교(e) {
  e.preventDefault();
  try {
    const form = document.forms[0];
    const selectedOption = form.elements['options'].value;

    let strCorrect = form.elements['correctArea'].value;
    let strInput = form.elements['inputArea'].value;

    switch (selectedOption) {
      case 'toBana':
        // const replacer = false;
        strCorrect = unicodeToBana(strCorrect);
        strInput = unicodeToBana(strInput);
        break;
      case 'toUnicode':
        strCorrect = banaToUnicode(strCorrect, true);
        strInput = banaToUnicode(strInput, true);
        break;
      default:
        break;
    }

    const compResult = needlemanWunschAlignment(strCorrect, strInput);

    resultArea.replaceChildren();
    resultArea.classList.toggle('braille', selectedOption !== 'none');

    let currentRow = document.createElement('div');
    currentRow.className = 'row';

    for (let { charCorrect, charInput, stat } of compResult) {
      charCorrect = visualizeLetter(charCorrect);
      charInput = visualizeLetter(charInput);

      let child;
      if (stat == 'match') {
        child = document.createElement('span');
        child.append(charCorrect);
      } else {
        child = document.createElement('table');
        child.border = 0;
        child.className = stat;
        const trCorrect = document.createElement('tr');
        const tdCorrect = document.createElement('td');
        let htmlCorrect = stat === 'insertion' ? '↑' : charCorrect;
        if (stat === 'deletion') htmlCorrect = `<ins>${htmlCorrect}</ins>`;
        tdCorrect.insertAdjacentHTML('beforeend', htmlCorrect);
        trCorrect.appendChild(tdCorrect);
        child.appendChild(trCorrect);

        const trInput = document.createElement('tr');
        const tdInput = document.createElement('td');
        let htmlInput = stat === 'deletion' ? '↓' : charInput;
        if (stat !== 'deletion') htmlInput = `<del>${htmlInput}</del>`;
        tdInput.insertAdjacentHTML('beforeend', htmlInput);
        trInput.appendChild(tdInput);
        child.appendChild(trInput);
      }

      currentRow.appendChild(child);

      if ('\r\n↵⏎␌'.includes(charCorrect) || '\r\n↵⏎␌'.includes(charInput)) {
        resultArea.appendChild(currentRow);
        currentRow = document.createElement('div');
        currentRow.className = 'row';
      }
    }

    resultArea.appendChild(currentRow);

    return false;
  } catch (error) {
    alert(error);
  }
}

function visualizeLetter(char) {
  if ('\t' === char) return '→';
  else if ('\v' === char) return '↵';
  else if ('\r\n'.includes(char)) return '⏎';
  else if ('\f' === char) return '␌';
  else if (/\s/.test(char))
    return '\u2423'; // &blank; ␣
  else if (char == null) return '␡';
  else return char;
}
