export function* binarySearch(cards, targetValue) {
    yield {
        type: 'info',
        message: `二分探索 (1-Based Indexing)。範囲 [1, 13] で開始します。`,
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
            message: `範囲 [${k_low}, ${k_high}] の中央 aaa[${k_mid}] を確認`,
            variables: { k_low, k_high, k_mid, midValue: cards[k_mid].value, target: targetValue },
            codeLine: 5
        };

        const midValue = cards[k_mid].value;

        if (midValue === targetValue) {
            yield {
                type: 'found',
                indices: [k_mid],
                message: `aaa[${k_mid}] で発見しました！`,
                variables: { foundAt: k_mid },
                codeLine: 8
            };
            return;
        } else if (midValue < targetValue) {
            yield {
                type: 'info',
                message: `${midValue} < ${targetValue} なので、右側 [${k_mid + 1}, ${k_high}] へ`,
                variables: { k_low: k_mid + 1, k_high },
                codeLine: 10
            };
            k_low = k_mid + 1;
        } else {
            yield {
                type: 'info',
                message: `${midValue} > ${targetValue} なので、左側 [${k_low}, ${k_mid - 1}] へ`,
                variables: { k_low, k_high: k_mid - 1 },
                codeLine: 12
            };
            k_high = k_mid - 1;
        }
    }

    yield {
        type: 'info',
        message: `見つかりませんでした`,
        variables: { found: false },
        codeLine: 15
    };
}
