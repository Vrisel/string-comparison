function 비교(e) {
	e.preventDefault();
	try{
	
        const corr = banaToUnicode(banaLint(correctArea.value));
        correctArea.value = corr;
        const inpu = banaToUnicode(banaLint(inputArea.value));
        inputArea.value = inpu;
        
        const compResult = needlemanWunschAlignment(corr, inpu);

        resultArea.replaceChildren();
        
        let currentRow = document.createElement('div');
        currentRow.className = 'row';

        for (const {
            charCorrect,
            charInput,
            stat
        } of compResult) {
            let child;
            if (stat == 'match') {
                child = document.createElement('span');
                child.append(charCorrect);
            }
            else {
                child = document.createElement('table');
                child.border = 0;
                child.className = stat;
                
                for (const c of [charCorrect, charInput]) {
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    
                    td.append(
                        c == null
                        ? 'x' //'❌'
                        : '\r\n↵⏎'.includes(c)
                        ? '⏎'
                        : c
                    );
                    tr.appendChild(td);
                    child.appendChild(tr);
                }
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
	} catch (error) { alert(error); }
}
