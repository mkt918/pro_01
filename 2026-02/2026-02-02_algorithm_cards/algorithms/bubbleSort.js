export function* bubbleSort(cards) {
    let n = cards.length - 1;

    yield {
        type: 'info',
        message: `バブルソート (1-based)。要素数 ${n}。隣り合う要素 aaa[j], aaa[j+1] を比較します。`,
        variables: { n },
        codeLine: 1
    };

    // Use i for pass count (0 to n-2)
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        // Use j for array index (1 to n-i-1)
        for (let j = 1; j <= n - i - 1; j++) {
            yield {
                type: 'compare',
                indices: [j, j + 1],
                message: `比較: aaa[${j}](${cards[j].value}) vs aaa[${j + 1}](${cards[j + 1].value})`,
                variables: { i, j, next: j + 1 },
                codeLine: 5
            };

            if (cards[j].value > cards[j + 1].value) {
                yield {
                    type: 'swap',
                    indexA: j,
                    indexB: j + 1,
                    message: `交換: ${cards[j].value} > ${cards[j + 1].value}`,
                    variables: { i, j, next: j + 1 },
                    codeLine: 7
                };

                [cards[j], cards[j + 1]] = [cards[j + 1], cards[j]];
                swapped = true;
            }
        }

        yield {
            type: 'sorted',
            indices: [n - i],
            message: `aaa[${n - i}] が確定しました`,
            variables: { i },
            codeLine: 15
        };

        if (!swapped) break;
    }

    yield {
        type: 'sorted',
        indices: Array.from({ length: n }, (_, idx) => idx + 1),
        message: `ソート完了`,
        variables: {},
        codeLine: 20
    };
}
