export function* bubbleSort(cards) {
    let n = cards.length - 1;

    yield {
        type: 'info',
        message: `バブルソートをはじめよう！カードの枚数13枚に対して、最大12回繰り返して並べ替えていくよ。`,
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
                message: `「j」は今見ている場所だよ。hairetsu[${j}] と隣の [${j + 1}] を比べて、左が大きければ右へ流していくよ。`,
                variables: { i: i + 1, j, next: j + 1 },
                codeLine: 3
            };

            if (cards[j].value > cards[j + 1].value) {
                yield {
                    type: 'swap',
                    indexA: j,
                    indexB: j + 1,
                    message: `左のほうが大きいので、SWAP（入れ替え）を行うよ。大きい数字が右側に移動したね。`,
                    variables: { i: i + 1, j, next: j + 1 },
                    codeLine: 4
                };

                [cards[j], cards[j + 1]] = [cards[j + 1], cards[j]];
                swapped = true;
            }
        }

        yield {
            type: 'sorted',
            indices: [n - i],
            message: `一番右端まで大きい数字が運ばれたね。これで hairetsu[${n - i}] の場所が確定したよ。`,
            variables: { i: i + 1 },
            codeLine: 1
        };

        if (!swapped) break;
    }

    yield {
        type: 'sorted',
        indices: Array.from({ length: n }, (_, idx) => idx + 1),
        message: `全てのカードの並び替えが完了したよ！`,
        variables: {},
        codeLine: 1
    };
}
