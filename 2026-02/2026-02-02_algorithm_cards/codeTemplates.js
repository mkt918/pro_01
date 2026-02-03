export const codeTemplates = {
    linear: [
        "SET target = (探したい数字)",
        "FOR k = 1 TO 13",
        "  IF hairetsu[k] == target THEN",
        "    SET foundAt = k : EXIT FOR",
        "  END IF",
        "NEXT k",
        "IF foundAt == NULL THEN (見つからず)"
    ],
    binary: [
        "SET k_low = 1, k_high = 13",
        "WHILE k_low <= k_high",
        "  SET k_mid = (k_low + k_high) / 2",
        "  IF hairetsu[k_mid] == target THEN",
        "    SET foundAt = k_mid : EXIT WHILE",
        "  ELSE IF hairetsu[k_mid] < target THEN",
        "    SET k_low = k_mid + 1",
        "  ELSE",
        "    SET k_high = k_mid - 1",
        "  END IF",
        "WEND"
    ],
    minmax: [
        "SET Max = hairetsu[1], Min = hairetsu[1]",
        "FOR k = 2 TO 13",
        "  IF hairetsu[k] > Max THEN",
        "    SET Max = hairetsu[k]",
        "  ELSE IF hairetsu[k] < Min THEN",
        "    SET Min = hairetsu[k]",
        "  END IF",
        "NEXT k"
    ],
    bubble: [
        "FOR i = 1 TO 12",
        "  FOR j = 1 TO 13 - i",
        "    IF hairetsu[j] > hairetsu[j + 1] THEN",
        "      SWAP hairetsu[j], hairetsu[j + 1]",
        "    END IF",
        "  NEXT j",
        "NEXT i"
    ],
    selection: [
        "FOR k = 1 TO 12",
        "  SET minIndex = k",
        "  FOR j = k + 1 TO 13",
        "    IF hairetsu[j] < hairetsu[minIndex] THEN",
        "      SET minIndex = j",
        "    END IF",
        "  NEXT j",
        "  SWAP hairetsu[k], hairetsu[minIndex]",
        "NEXT k"
    ],
    insertion: [
        "FOR k = 2 TO 13",
        "  SET hozon = hairetsu[k]",
        "  SET j = k - 1",
        "  WHILE j >= 1 AND hairetsu[j] > hozon",
        "    SET hairetsu[j + 1] = hairetsu[j]",
        "    SET j = j - 1",
        "  WEND",
        "  SET hairetsu[j + 1] = hozon",
        "NEXT k"
    ],
    manual: [
        "== マニュアル操作 (Manual) ==",
        "自由自在にカードを操作してみよう！",
        "・ドラッグで「hairetsu[]」や「各スロット」へコピー",
        "・「元に戻す (Undo)」で操作を巻き戻し",
        "・変数ボックスに好きな数字を入れてシミュレーション！"
    ]
};
