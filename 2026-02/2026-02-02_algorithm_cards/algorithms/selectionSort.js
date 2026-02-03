export function* selectionSort(cards) {
    let n = cards.length - 1; // 13

    yield {
        type: 'info',
        message: `選択ソートはじめるよ。一番小さい数字を探して、左から順番に並べていくね。`,
        variables: { n },
        codeLine: 1
    };

    // Use k for outer index
    for (let k = 1; k < n; k++) {
        let minIdx = k;

        yield {
            type: 'select',
            indices: [minIdx],
            message: `まずはこのカード (${cards[minIdx].value}) を「暫定の最小」として覚えておくよ。`,
            variables: { k, minIdx },
            codeLine: 3
        };

        for (let j = k + 1; j <= n; j++) {
            yield {
                type: 'compare',
                indices: [minIdx, j],
                message: `暫定の最小 (${cards[minIdx].value}) と、このカード (${cards[j].value}) を比べるよ。`,
                variables: { minIdx, j },
                codeLine: 4
            };

            if (cards[j].value < cards[minIdx].value) {
                minIdx = j;
                yield {
                    type: 'select',
                    indices: [minIdx],
                    message: `もっと小さい数字 (${cards[minIdx].value}) を発見！こっちを新しい最小として覚えるね。`,
                    variables: { minIdx, newMin: cards[minIdx].value },
                    codeLine: 6
                };
            }
        }

        if (minIdx !== k) {
            yield {
                type: 'swap',
                indexA: k,
                indexB: minIdx,
                message: `見つけた一番小さい数字 (${cards[minIdx].value}) を、左のカードと入れ替えるよ (交換)`,
                variables: { k, minIdx },
                codeLine: 8
            };
            [cards[k], cards[minIdx]] = [cards[minIdx], cards[k]];
        }

        yield {
            type: 'sorted',
            indices: [k],
            message: `これで aaa[${k}] の場所は決定！ (確定)`,
            variables: { k },
            codeLine: 9
        };
    }

    yield {
        type: 'sorted',
        indices: Array.from({ length: n }, (_, i) => i + 1),
        message: `全部の並び替えが終わったよ！ (完了)`,
        variables: {},
        codeLine: 10
    };
}
