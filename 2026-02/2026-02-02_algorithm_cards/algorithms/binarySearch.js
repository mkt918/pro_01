export function* binarySearch(cards, targetValue) {
    yield {
        type: 'info',
        message: `二分探索を開始します。範囲 [1, 13] でターゲット ${targetValue} を探します。`,
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
            message: `範囲 [${k_low}, ${k_high}] の中央 aaa[${k_mid}] (${cards[k_mid].value}) を確認します。`,
            variables: { k_low, k_high, k_mid, midValue: cards[k_mid].value, target: targetValue },
            codeLine: 5
        };

        const midValue = cards[k_mid].value;

        if (midValue === targetValue) {
            yield {
                type: 'to_foundAt',
                index: k_mid,
                message: `ターゲットを発見！ カードを foundAt に移動します。`,
                variables: { foundAt: k_mid },
                codeLine: 8
            };

            yield {
                type: 'found',
                indices: [k_mid],
                message: `探索完了: aaa[${k_mid}] = ${targetValue}`,
                variables: { foundAt: k_mid },
                codeLine: 9
            };
            return;
        } else if (midValue < targetValue) {
            yield {
                type: 'info',
                message: `${midValue} < ${targetValue} なので、右半分の [${k_mid + 1}, ${k_high}] を次の範囲にします。`,
                variables: { k_low: k_mid + 1, k_high },
                codeLine: 11
            };
            k_low = k_mid + 1;
        } else {
            yield {
                type: 'info',
                message: `${midValue} > ${targetValue} なので、左半分の [${k_low}, ${k_mid - 1}] を次の範囲にします。`,
                variables: { k_low, k_high: k_mid - 1 },
                codeLine: 13
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
