export function* bubbleSort(cards) {
    let n = cards.length - 1;

    yield {
        type: 'info',
        message: `バブルソートをはじめよう！カードの枚数は ${n} 枚だね。`,
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
                message: `左 (${cards[j].value}) と 右 (${cards[j + 1].value}) を比べるよ。左のほうが大きいかな？`,
                variables: { i, j, next: j + 1 },
                codeLine: 4
            };

            if (cards[j].value > cards[j + 1].value) {
                yield {
                    type: 'swap',
                    indexA: j,
                    indexB: j + 1,
                    message: `左のほうが大きいね！場所を入れ替えるよ (交換)`,
                    variables: { i, j, next: j + 1 },
                    codeLine: 5
                };

                [cards[j], cards[j + 1]] = [cards[j + 1], cards[j]];
                swapped = true;
            }
        }

        yield {
            type: 'sorted',
            indices: [n - i],
            message: `これで aaa[${n - i}] のカードは場所が決定！ (確定)`,
            variables: { i },
            codeLine: 8
        };

        if (!swapped) break;
    }

    yield {
        type: 'sorted',
        indices: Array.from({ length: n }, (_, idx) => idx + 1),
        message: `全部の並び替えが終わったよ！ (完了)`,
        variables: {},
        codeLine: 9
    };
}
