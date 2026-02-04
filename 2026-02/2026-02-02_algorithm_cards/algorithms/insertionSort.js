export function* insertionSort(cards) {
    let n = cards.length - 1;

    yield {
        type: 'info',
        message: `挿入ソートを開始！左から順番に「整列済みの列」を広げていくアルゴリズムだよ。`,
        variables: { n },
        codeLine: 1
    };

    yield {
        type: 'sorted',
        indices: [1],
        message: `まず1番目のカードは「最初から整列済み」とみなすよ。ここを基準に始めよう。`,
        variables: {},
        codeLine: 1
    };

    // Use k for outer loop (current element to insert)
    for (let k = 2; k <= n; k++) {
        let key = cards[k]; // Store in hozon
        let j = k - 1;

        yield {
            type: 'to_hozon',
            index: k,
            value: key.value,
            message: `「k」は今から並べたいカードの番号だよ。場所を探す間、邪魔にならないよう「hozon」という一時的な箱（手元）に ${key.value} を退避させるね。`,
            variables: { k, hozon: key.value },
            codeLine: 2
        };

        while (j >= 1 && cards[j].value > key.value) {
            yield {
                type: 'compare',
                indices: [j, j + 1],
                message: `左のカード (${cards[j].value}) は 手元のカード (${key.value}) より大きいかな？`,
                variables: { j, hozon: key.value },
                codeLine: 4 // WHILE (Condition)
            };

            yield {
                type: 'swap',
                indexA: j,
                indexB: j + 1,
                message: `左のほうが大きいので、右にずらして空き場所を広げよう。`,
                variables: { j, jNext: j + 1 },
                codeLine: 5 // SET hairetsu[j+1]
            };

            [cards[j], cards[j + 1]] = [cards[j + 1], cards[j]];
            j = j - 1;

            yield {
                type: 'info',
                message: `「j」を 1 つ減らして、さらに左側のカードも確認してみるね。`,
                variables: { j, hozon: key.value },
                codeLine: 4 // WHILE (Next potential check)
            };
        }

        yield {
            type: 'from_hozon',
            index: j + 1,
            message: `これ以上左には大きいカードがないね。空いた場所（hairetsu[${j + 1}]）に、hozon からカードを戻して挿入完了！`,
            variables: { j: j + 1, hozon: key.value },
            codeLine: 9
        };

        const sortedIndices = Array.from({ length: k }, (_, idx) => idx + 1);
        yield {
            type: 'sorted',
            indices: sortedIndices,
            message: `これで「k」番目までのカードが正しい順番に並んだことになるよ。`,
            variables: { k },
            codeLine: 10
        };

        yield {
            type: 'clear_hozon',
            message: '',
            variables: {},
            codeLine: null
        };
    }

    yield {
        type: 'sorted',
        indices: Array.from({ length: n }, (_, i) => i + 1),
        message: `全てのカードの挿入が終わり、完璧に並べ替えできたよ！`,
        variables: {},
        codeLine: 1
    };
}
