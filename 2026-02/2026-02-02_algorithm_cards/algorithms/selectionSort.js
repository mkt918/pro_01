export function* selectionSort(cards) {
    let n = cards.length - 1; // 13

    yield {
        type: 'info',
        message: `選択ソート (1-based)。aaa[1] から aaa[${n}] まで整列させていきます。`,
        variables: { n },
        codeLine: 1
    };

    // Use k for outer index
    for (let k = 1; k < n; k++) {
        let minIdx = k;

        yield {
            type: 'select',
            indices: [minIdx],
            message: `暫定最小: aaa[${minIdx}]`,
            variables: { k, minIdx },
            codeLine: 5
        };

        for (let j = k + 1; j <= n; j++) {
            yield {
                type: 'compare',
                indices: [minIdx, j],
                message: `比較: 暫定最小(${cards[minIdx].value}) vs aaa[${j}](${cards[j].value})`,
                variables: { minIdx, j },
                codeLine: 8
            };

            if (cards[j].value < cards[minIdx].value) {
                minIdx = j;
                yield {
                    type: 'select',
                    indices: [minIdx],
                    message: `新最小発見: ${cards[minIdx].value} (場所: aaa[${minIdx}])`,
                    variables: { minIdx, newMin: cards[minIdx].value },
                    codeLine: 10
                };
            }
        }

        if (minIdx !== k) {
            yield {
                type: 'swap',
                indexA: k,
                indexB: minIdx,
                message: `最小値 aaa[${minIdx}] を未ソート先頭 aaa[${k}] と交換`,
                variables: { k, minIdx },
                codeLine: 15
            };
            [cards[k], cards[minIdx]] = [cards[minIdx], cards[k]];
        }

        yield {
            type: 'sorted',
            indices: [k],
            message: `aaa[${k}] が確定`,
            variables: { k },
            codeLine: 18
        };
    }

    yield {
        type: 'sorted',
        indices: Array.from({ length: n }, (_, i) => i + 1),
        message: `ソート完了`,
        variables: {},
        codeLine: 20
    };
}
