function banaLint(str) {
	let dict = {
		"`":"@", "~":"^", "{":"[", "}":"]", "|":"\\",
		"“":'"', "”":'"',
		"’":"'", "‘":"'"
	};
	return str.replace(
		/./gi,
		c => c in dict ? dict[c] : c.toUpperCase()
	);
}

function banaToUnicode(str) {
	const bana = ' A1B\'K2L@CIF/MSP"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=';
	return str.replace(
		/./gi,
		c => {
			//const charCode = c.charCodeAt();
			//if (charCode>=0x2800 && charCode<=0x28ff) return c;
			if (c>='⠀' && c<='⠿') return c;
			
			let idx = bana.indexOf(c);
			if (idx >= 0) return String.fromCharCode(0x2800 + idx)
			if ('\r\n↵⏎'.includes(c)) return '⏎'
			else return String.fromCharCode(0x2800) //throw new Error("유니코드 변환 실패")
		}
	);
}
