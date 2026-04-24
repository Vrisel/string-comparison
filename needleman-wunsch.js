function needlemanWunschAlignment(strCorrect, strInput) {
  const matchScore = 0;
  const penalties = {
    mismatch: -2,
    gap: -1,
    enter: 0
  };

  const n = strCorrect.length;
  const m = strInput.length;

  // DP 테이블: 점수만 저장 (메모리 최적화)
  let prevRow = Array(m + 1).fill(0);
  let currRow = Array(m + 1).fill(0);

  // Traceback을 위해 방향 저장 (필요 최소한만)
  const trace = Array.from({ length: n + 1 }, () => Array(m + 1).fill(null));

  for (let j = 0; j <= m; j++) {
    prevRow[j] = j * penalties.gap;
    trace[0][j] = "left";
  }
  for (let i = 0; i <= n; i++) {
    trace[i][0] = "up";
  }

  // DP 계산
  for (let i = 1; i <= n; i++) {
    currRow[0] = i * penalties.gap;
    for (let j = 1; j <= m; j++) {
      const charC = strCorrect[i - 1];
      const charI = strInput[j - 1];

      const scoreDiag = prevRow[j - 1] + (charC === charI ? matchScore : penalties.mismatch);
      const scoreUp = prevRow[j] + (charC === '\n' ? penalties.enter : penalties.gap);
      const scoreLeft = currRow[j - 1] + (charI === '\n' ? penalties.enter : penalties.gap);

      const maxScore = Math.max(scoreDiag, scoreUp, scoreLeft);
      currRow[j] = maxScore;

      if (maxScore === scoreDiag) trace[i][j] = "diag";
      else if (maxScore === scoreUp) trace[i][j] = "up";
      else trace[i][j] = "left";
    }
    [prevRow, currRow] = [currRow, prevRow];
  }

  // Traceback으로 alignment 복원
  let i = n, j = m;
  const details = [];

  while (i > 0 || j > 0) {
    const charCorrect = strCorrect[i - 1];
    const charInput = strInput[j - 1];

    if (trace[i][j] === "diag") {
      details.push({
        charCorrect,
        charInput,
        stat: (charCorrect === charInput ? "match" : "mismatch")
      });
      i--; j--;
    } else if (trace[i][j] === "up") {
      details.push({
        charCorrect,
        charInput: null,
        stat: (charCorrect === '\n' ? "enter" : "deletion")
      });
      i--;
    } else {
      details.push({
        charCorrect: null,
        charInput,
        stat: (charInput === '\n' ? "enter" : "insertion")
      });
      j--;
    }
  }

  return details.reverse();
}
