export function* binarySearch(cards, targetValue) {
    yield {
        type: 'info',
        message: `二分探索をはじめるよ。${targetValue} を探そう！最初は全部のカードが範囲だよ。`,
        variables: { target: targetValue, k_low: 1, k_high: cards.length - 1 },
        codeLine: 1
    };

    let k_low = 1;
    let k_high = cards.length - 1;

    while (k_low <= k_high) {
        const k_mid = Math.floor((k_low + k_high) / 2);

        yield {
            type: 'compare',
            indices: [k_low, k_high, k_mid],
            message: `真ん中のカード aaa[${k_mid}] (${cards[k_mid].value}) を見てみよう。`,
            variables: { k_low, k_high, k_mid, midValue: cards[k_mid].value, target: targetValue },
            codeLine: 3
        };

        const midValue = cards[k_mid].value;

        if (midValue === targetValue) {
            yield {
                type: 'to_foundAt',
                index: k_mid,
                message: `やった！見つけたよ！`,
                variables: { foundAt: k_mid },
                codeLine: 4
            };

            yield {
                type: 'found',
                indices: [k_mid],
                message: `探していた数字 ${targetValue} はここにあったね！`,
                variables: { foundAt: k_mid },
                codeLine: 4
            };
            return;
        } else if (midValue < targetValue) {
            yield {
                type: 'info',
                message: `${midValue} は ${targetValue} より小さいね。もっと大きい数字側（右）を探そう！`,
                variables: { k_low: k_mid + 1, k_high },
                codeLine: 5
            };
            k_low = k_mid + 1;
            // Additional yield for "Update Range" step? Or combine?
            // Let's just update the range visual on next loop or implicitly.
            // Template Step 6 says "Search right".
            yield {
                type: 'info',
                message: `探す範囲を右側にしぼったよ。`,
                variables: { k_low, k_high },
                codeLine: 6
            }
        } else {
            yield {
                type: 'info',
                message: `${midValue} は ${targetValue} より大きいね。もっと小さい数字側（左）を探そう！`,
                variables: { k_low, k_high: k_mid - 1 },
                codeLine: 7 // "else (smaller)"
            };
            k_high = k_mid - 1;
            yield {
                type: 'info',
                message: `探す範囲を左側にしぼったよ。`,
                variables: { k_low, k_high },
                codeLine: 8
            }
        }
    }

    yield {
        type: 'info',
        message: `最後まで探したけど、見つからなかったね...`,
        variables: { found: false },
        codeLine: 10
    };
}
