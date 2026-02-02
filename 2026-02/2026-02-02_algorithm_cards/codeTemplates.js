export const codeTemplates = {
    linear: [
        "1. ターゲットを設定 (target)",
        "2. k = 1 から N まで aaa[k] を確認",
        "3. if (aaa[k] == target) 見つかりました！",
        "4. loop 終了",
        "5. 見つかりませんでした"
    ],
    binary: [
        "1. low = 1, high = N",
        "2. while (low <= high)",
        "3.   mid = (low + high) / 2",
        "4.   check aaa[mid]",
        "5.   if (aaa[mid] == target)",
        "6.     見つかりました",
        "7.   else if (aaa[mid] < target)",
        "8.     low = mid + 1",
        "9.   else",
        "10.    high = mid - 1",
        "11. end while",
        "12. 見つかりませんでした"
    ],
    minmax: [
        "1. 最大値探索開始。maxIndex = 1",
        "2. 暫定最大 hozon = aaa[1]",
        "3. loop k = 2 to N",
        "4.   if (aaa[k] > hozon)",
        "5.     hozon = aaa[k]",
        "6.     maxIndex = k",
        "7. end loop",
        "8. 終了。最大は hozon (at aaa[maxIndex])"
    ],
    bubble: [
        "1. バブルソート開始",
        "2. loop i = 0 to N-1 (count)", // i is count
        "3.   loop j = 1 to N-i-1 (index)",
        "4.     if (aaa[j] > aaa[j+1])",
        "5.       swap(aaa[j], aaa[j+1])",
        "6.     end if",
        "7.   end loop",
        "8. aaa[N-i] 確定",
        "9. end loop"
    ],
    selection: [
        "1. 選択ソート開始",
        "2. loop k = 1 to N-1", // k is index
        "3.   minIdx = k",
        "4.   loop j = k+1 to N",
        "5.     if (aaa[j] < aaa[minIdx])",
        "6.       minIdx = j",
        "7.   end loop",
        "8.   swap(aaa[k], aaa[minIdx])",
        "9. aaa[k] 確定",
        "10. end loop"
    ],
    insertion: [
        "1. 挿入ソート開始",
        "2. loop k = 2 to N", // k is index
        "3.   hozon = aaa[k]",
        "4.   j = k - 1",
        "5.   while (j >= 1 && aaa[j] > hozon)",
        "6.     aaa[j+1] = aaa[j]",
        "7.     j--",
        "8.   end while",
        "9.   aaa[j+1] = hozon",
        "10. aaa[1..k] ソート完了",
        "11. end loop"
    ]
};
