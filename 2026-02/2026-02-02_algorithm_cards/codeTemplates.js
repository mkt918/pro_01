export const codeTemplates = {
    linear: {
        macro: [
            { text: "SET target = (探したい数字)", step: 1 },
            { text: "FOR k = 1 TO 13", step: 2 },
            { text: "    IF hairetsu[k] == target THEN", step: 3 },
            { text: "        SET foundAt = k : EXIT FOR", step: 4 },
            { text: "    END IF", step: 3 },
            { text: "NEXT k", step: 2 },
            { text: "IF foundAt == NULL THEN (見つからず)", step: 7 }
        ],
        python: [
            { text: "target = 2 # 探したい数字", step: 1 },
            { text: "found_at = -1", step: 1 },
            { text: "for k in range(0, len(hairetsu)):", step: 2 },
            { text: "    if hairetsu[k] == target:", step: 3 },
            { text: "        found_at = k", step: 4 },
            { text: "        break", step: 4 },
            { text: "print(f'Found at: {found_at}')", step: 7 }
        ]
    },
    binary: {
        macro: [
            { text: "SET k_low = 1, k_high = 13", step: 1 },
            { text: "WHILE k_low <= k_high", step: 2 },
            { text: "    SET k_mid = (k_low + k_high) / 2", step: 3 },
            { text: "    IF hairetsu[k_mid] == target THEN", step: 4 },
            { text: "        SET foundAt = k_mid : EXIT WHILE", step: 5 },
            { text: "    ELSE IF hairetsu[k_mid] < target THEN", step: 6 },
            { text: "        SET k_low = k_mid + 1", step: 7 },
            { text: "    ELSE", step: 8 },
            { text: "        SET k_high = k_mid - 1", step: 9 },
            { text: "    END IF", step: 2 },
            { text: "WEND", step: 2 },
            { text: "IF k_low > k_high THEN (見つからず)", step: 11 }
        ],
        python: [
            { text: "low, high = 0, len(hairetsu) - 1", step: 1 },
            { text: "found_at = -1", step: 1 },
            { text: "while low <= high:", step: 2 },
            { text: "    mid = (low + high) // 2", step: 3 },
            { text: "    if hairetsu[mid] == target:", step: 4 },
            { text: "        found_at = mid", step: 5 },
            { text: "        break", step: 5 },
            { text: "    elif hairetsu[mid] < target:", step: 6 },
            { text: "        low = mid + 1", step: 7 },
            { text: "    else:", step: 8 },
            { text: "        high = mid - 1", step: 9 },
            { text: "print(f'Found at: {found_at}')", step: 11 }
        ]
    },
    minmax: {
        macro: [
            { text: "SET Max = hairetsu[1], Min = hairetsu[1]", step: 1 },
            { text: "FOR k = 2 TO 13", step: 2 },
            { text: "    IF hairetsu[k] > Max THEN", step: 3 },
            { text: "        SET Max = hairetsu[k]", step: 4 },
            { text: "    ELSE IF hairetsu[k] < Min THEN", step: 5 },
            { text: "        SET Min = hairetsu[k]", step: 6 },
            { text: "    END IF", step: 2 },
            { text: "NEXT k", step: 2 }
        ],
        python: [
            { text: "max_val = hairetsu[0]", step: 1 },
            { text: "min_val = hairetsu[0]", step: 1 },
            { text: "for k in range(1, len(hairetsu)):", step: 2 },
            { text: "    if hairetsu[k] > max_val:", step: 3 },
            { text: "        max_val = hairetsu[k]", step: 4 },
            { text: "    elif hairetsu[k] < min_val:", step: 5 },
            { text: "        min_val = hairetsu[k]", step: 6 },
            { text: "print(f'Max: {max_val}, Min: {min_val}')", step: 1 }
        ]
    },
    bubble: {
        macro: [
            { text: "FOR i = 1 TO 12", step: 1 },
            { text: "    FOR j = 1 TO 13 - i", step: 2 },
            { text: "        IF hairetsu[j] > hairetsu[j + 1] THEN", step: 3 },
            { text: "            SWAP hairetsu[j], hairetsu[j + 1]", step: 4 },
            { text: "        END IF", step: 2 },
            { text: "    NEXT j", step: 2 },
            { text: "NEXT i", step: 1 }
        ],
        python: [
            { text: "n = len(hairetsu)", step: 1 },
            { text: "for i in range(n):", step: 1 },
            { text: "    swapped = False", step: 1 },
            { text: "    for j in range(0, n - i - 1):", step: 2 },
            { text: "        if hairetsu[j] > hairetsu[j + 1]:", step: 3 },
            { text: "            hairetsu[j], hairetsu[j + 1] = \\", step: 4 },
            { text: "                hairetsu[j+1], hairetsu[j]", step: 4 },
            { text: "            swapped = True", step: 4 },
            { text: "    if not swapped: break", step: 1 },
            { text: "print('Sorted list:', hairetsu)", step: 1 }
        ]
    },
    selection: {
        macro: [
            { text: "FOR k = 1 TO 12", step: 1 },
            { text: "    SET minIndex = k", step: 2 },
            { text: "    FOR j = k + 1 TO 13", step: 3 },
            { text: "        IF hairetsu[j] < hairetsu[minIndex] THEN", step: 4 },
            { text: "            SET minIndex = j", step: 5 },
            { text: "        END IF", step: 3 },
            { text: "    NEXT j", step: 3 },
            { text: "    SWAP hairetsu[k], hairetsu[minIndex]", step: 8 },
            { text: "NEXT k", step: 9 }
        ],
        python: [
            { text: "n = len(hairetsu)", step: 1 },
            { text: "for k in range(n):", step: 1 },
            { text: "    min_idx = k", step: 2 },
            { text: "    for j in range(k + 1, n):", step: 3 },
            { text: "        if hairetsu[j] < hairetsu[min_idx]:", step: 4 },
            { text: "            min_idx = j", step: 5 },
            { text: "    if min_idx != k:", step: 8 },
            { text: "        hairetsu[k], hairetsu[min_idx] = \\", step: 8 },
            { text: "            hairetsu[min_idx], hairetsu[k]", step: 8 },
            { text: "print('Sorted list:', hairetsu)", step: 9 }
        ]
    },
    insertion: {
        macro: [
            { text: "FOR k = 2 TO 13", step: 1 },
            { text: "    SET hozon = hairetsu[k]", step: 2 },
            { text: "    SET j = k - 1", step: 2 },
            { text: "    WHILE j >= 1 AND hairetsu[j] > hozon", step: 4 },
            { text: "        SET hairetsu[j + 1] = hairetsu[j]", step: 5 },
            { text: "        SET j = j - 1", step: 5 },
            { text: "    WEND", step: 4 },
            { text: "    SET hairetsu[j + 1] = hozon", step: 9 },
            { text: "NEXT k", step: 10 }
        ],
        python: [
            { text: "for k in range(1, len(hairetsu)):", step: 1 },
            { text: "    hozon = hairetsu[k]", step: 2 },
            { text: "    j = k - 1", step: 2 },
            { text: "    while j >= 0 and hairetsu[j] > hozon:", step: 4 },
            { text: "        hairetsu[j + 1] = hairetsu[j]", step: 5 },
            { text: "        j -= 1", step: 5 },
            { text: "    hairetsu[j + 1] = hozon", step: 9 },
            { text: "print('Sorted list:', hairetsu)", step: 10 }
        ]
    },
    manual: {
        macro: [
            { text: "== マニュアル操作 (Manual) ==", step: null },
            { text: "自由自在にカードを操作してみよう！", step: null },
            { text: "・ドラッグで「hairetsu[]」や「各スロット」へコピー", step: null },
            { text: "・「元に戻す (Undo)」で操作を巻き戻し", step: null },
            { text: "・変数ボックスに好きな数字を入れてシミュレーション！", step: null }
        ],
        python: [
            { text: "# Manual Mode", step: null },
            { text: "# Drag and drop cards to simulate algorithms.", step: null },
            { text: "# Use 'Undo' to step back.", step: null },
            { text: "# Change variables in the boxes above.", step: null }
        ]
    }
};
