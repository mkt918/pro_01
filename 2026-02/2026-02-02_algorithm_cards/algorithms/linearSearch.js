export function* linearSearch(cards, targetValue) {
    // k is index for cards array (aaa)

    yield {
        type: 'info',
        message: `探している数字「${targetValue}」を決めたよ。左から順番に見ていこう！`,
        variables: { target: targetValue },
        codeLine: 1
    };

    for (let k = 1; k < cards.length; k++) {
        yield {
            type: 'compare',
            indices: [k],
            message: `aaa[${k}] のカード (${cards[k].value}) はこれかな？`,
            variables: { k: k, value: cards[k].value, target: targetValue },
            codeLine: 2
        };

        if (cards[k].value === targetValue) {
            yield {
                type: 'to_foundAt',
                index: k,
                message: `あった！見つけたよ！`,
                variables: { k: k, found: true },
                codeLine: 3
            };

            yield {
                type: 'found',
                indices: [k],
                message: `探していた ${targetValue} を見つけました！`,
                variables: { k: k, found: true },
                codeLine: 3
            };
            return;
        }
    }

    yield {
        type: 'info',
        message: `最後まで探したけど、見つからなかったね...`,
        variables: { found: false },
        codeLine: 5
    };
}
