export function* linearSearch(cards, targetValue) {
    // k is index for cards array (aaa)

    yield {
        type: 'info',
        message: `ターゲット「${targetValue}」を探します (Searching for ${targetValue})。インデックス 1 から 13 まで順番に探します。`,
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
                type: 'found',
                indices: [k],
                message: `見つけました！ aaa[${k}] = ${targetValue}`,
                variables: { k: k, found: true },
                codeLine: 3
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
