export const codeTemplates = {
    linear: {
        macro: [
            "SET target = (探したい数字)",
            "FOR k = 1 TO 13",
            "  IF hairetsu[k] == target THEN",
            "    SET foundAt = k : EXIT FOR",
            "  END IF",
            "NEXT k",
            "IF foundAt == NULL THEN (見つからず)"
        ],
        python: [
            "target = 2 # 探したい数字",
            "found_at = -1",
            "for k in range(0, len(hairetsu)):",
            "    if hairetsu[k] == target:",
            "        found_at = k",
            "        break",
            "print(f'Found at: {found_at}')"
        ]
    },
    binary: {
        macro: [
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
        python: [
            "low, high = 0, len(hairetsu) - 1",
            "found_at = -1",
            "while low <= high:",
            "    mid = (low + high) // 2",
            "    if hairetsu[mid] == target:",
            "        found_at = mid",
            "        break",
            "    elif hairetsu[mid] < target:",
            "        low = mid + 1",
            "    else:",
            "        high = mid - 1",
            "print(f'Found at: {found_at}')"
        ]
    },
    minmax: {
        macro: [
            "SET Max = hairetsu[1], Min = hairetsu[1]",
            "FOR k = 2 TO 13",
            "  IF hairetsu[k] > Max THEN",
            "    SET Max = hairetsu[k]",
            "  ELSE IF hairetsu[k] < Min THEN",
            "    SET Min = hairetsu[k]",
            "  END IF",
            "NEXT k"
        ],
        python: [
            "max_val = hairetsu[0]",
            "min_val = hairetsu[0]",
            "for k in range(1, len(hairetsu)):",
            "    if hairetsu[k] > max_val:",
            "        max_val = hairetsu[k]",
            "    elif hairetsu[k] < min_val:",
            "        min_val = hairetsu[k]",
            "print(f'Max: {max_val}, Min: {min_val}')"
        ]
    },
    bubble: {
        macro: [
            "FOR i = 1 TO 12",
            "  FOR j = 1 TO 13 - i",
            "    IF hairetsu[j] > hairetsu[j + 1] THEN",
            "      SWAP hairetsu[j], hairetsu[j + 1]",
            "    END IF",
            "  NEXT j",
            "NEXT i"
        ],
        python: [
            "n = len(hairetsu)",
            "for i in range(n):",
            "    for j in range(0, n - i - 1):",
            "        if hairetsu[j] > hairetsu[j + 1]:",
            "            hairetsu[j], hairetsu[j + 1] = \\",
            "                hairetsu[j + 1], hairetsu[j]",
            "print('Sorted list:', hairetsu)"
        ]
    },
    selection: {
        macro: [
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
        python: [
            "n = len(hairetsu)",
            "for k in range(n):",
            "    min_idx = k",
            "    for j in range(k + 1, n):",
            "        if hairetsu[j] < hairetsu[min_idx]:",
            "            min_idx = j",
            "    hairetsu[k], hairetsu[min_idx] = \\",
            "        hairetsu[min_idx], hairetsu[k]",
            "print('Sorted list:', hairetsu)"
        ]
    },
    insertion: {
        macro: [
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
        python: [
            "for k in range(1, len(hairetsu)):",
            "    hozon = hairetsu[k]",
            "    j = k - 1",
            "    while j >= 0 and hairetsu[j] > hozon:",
            "        hairetsu[j + 1] = hairetsu[j]",
            "        j -= 1",
            "    hairetsu[j + 1] = hozon",
            "print('Sorted list:', hairetsu)"
        ]
    },
    manual: {
        macro: [
            "== マニュアル操作 (Manual) ==",
            "自由自在にカードを操作してみよう！",
            "・ドラッグで「hairetsu[]」や「各スロット」へコピー",
            "・「元に戻す (Undo)」で操作を巻き戻し",
            "・変数ボックスに好きな数字を入れてシミュレーション！"
        ],
        python: [
            "# Manual Mode",
            "# Drag and drop cards to simulate algorithms.",
            "# Use 'Undo' to step back.",
            "# Change variables in the boxes above."
        ]
    }
};
