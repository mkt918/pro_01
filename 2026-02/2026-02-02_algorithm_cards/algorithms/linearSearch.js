export function* linearSearch(cards, targetValue) {
    // k is index for cards array (aaa)

    yield {
        type: 'info',
        message: `ターゲット「${targetValue}」を探します。インデックス 1 から順番に確認します。`,
        variables: { target: targetValue },
        codeLine: 1
    };

    for (let k = 1; k < cards.length; k++) {
        yield {
            type: 'compare',
            indices: [k],
            message: `aaa[${k}] の値 ${cards[k].value} を確認中...`,
            variables: { k: k, value: cards[k].value, target: targetValue },
            codeLine: 2
        };

        if (cards[k].value === targetValue) {
            yield {
                type: 'to_foundAt',
                index: k,
                message: `見つけました！ カードを foundAt に移動します。`,
                variables: { k: k, found: true },
                codeLine: 3
            };

            yield {
                type: 'found',
                indices: [k],
                message: `探索完了: aaa[${k}] = ${targetValue}`,
                variables: { k: k, found: true },
                codeLine: 4
            };
            return;
        }
    }

    yield {
        type: 'info',
        message: `見つかりませんでした`,
        variables: { found: false },
        codeLine: 5
    };
}
