function 비교(e) {
  e.preventDefault();
  try {
    const form = document.forms[0];
    const selectedOption = form.elements['options'].value;

    let strCorrect = form.elements['correctArea'].value;
    let strInput = form.elements['inputArea'].value;

    switch (selectedOption) {
      case 'toBana':
        strCorrect = unicodeToBana(strCorrect, false);
        strInput = unicodeToBana(strInput, false);
        break;
      case 'toUnicode':
        strCorrect = banaToUnicode(strCorrect, true);
        strInput = banaToUnicode(strInput, true);
        break;
      default:
        break;
    }
    /*if (isBana.checked) {
      strCorrect = banaLint(strCorrect);
      strInput = banaLint(strInput);
    }
    if (toUnicode.checked) {
      strCorrect = banaToUnicode(strCorrect);
      strInput = banaToUnicode(strInput);
    }

    //correctArea.value = strCorrect;
    //inputArea.value = strInput;*/

    const compResult = needlemanWunschAlignment(strCorrect, strInput);

    resultArea.replaceChildren();
    resultArea.classList.toggle('braille', selectedOption === 'toBana');

    let currentRow = document.createElement('div');
    currentRow.className = 'row';

    for (const { charCorrect, charInput, stat } of compResult) {
      let child;
      if (stat == 'match') {
        child = document.createElement('span');
        child.append('\r\n↵⏎'.includes(charCorrect) ? '⏎' : charCorrect);
      } else {
        child = document.createElement('table');
        child.border = 0;
        child.className = stat;
        const trCorrect = document.createElement('tr');
        const tdCorrect = document.createElement('td');
        let htmlCorrect =
          stat === 'insertion'
            ? '↑'
            : charCorrect == null
              ? '␡'
              : '\r\n↵⏎'.includes(charCorrect)
                ? '⏎'
                : charCorrect;
        if (stat === 'deletion') htmlCorrect = `<ins>${htmlCorrect}</ins>`;
        tdCorrect.insertAdjacentHTML('beforeend', htmlCorrect);
        trCorrect.appendChild(tdCorrect);
        child.appendChild(trCorrect);

        const trInput = document.createElement('tr');
        const tdInput = document.createElement('td');
        let htmlInput =
          stat === 'deletion'
            ? '↓'
            : charInput == null
              ? '␡'
              : '\r\n↵⏎'.includes(charInput)
                ? '⏎'
                : charInput;
        if (stat !== 'deletion') htmlInput = `<del>${htmlInput}</del>`;
        tdInput.insertAdjacentHTML('beforeend', htmlInput);
        trInput.appendChild(tdInput);
        child.appendChild(trInput);
      }

      currentRow.appendChild(child);

      if ('\r\n↵⏎'.includes(charCorrect)) {
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
