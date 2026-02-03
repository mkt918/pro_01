export function* selectionSort(cards) {
    let n = cards.length - 1; // 13

    yield {
        type: 'info',
        message: `選択ソート開始！一番小さい数字を見つけて、左（hairetsu[k]）から順に埋めていくよ。`,
        variables: { n },
        codeLine: 1
    };

    // Use k for outer index
    for (let k = 1; k < n; k++) {
        let minIdx = k;

        yield {
            type: 'select',
            indices: [minIdx],
            message: `「k」は今から確定させたい場所だよ。まずは「minIndex」という箱に ${k} を入れて、暫定最小とするね。`,
            variables: { k, minIndex: minIdx },
            codeLine: 2
        };

        for (let j = k + 1; j <= n; j++) {
            yield {
                type: 'compare',
                indices: [minIdx, j],
                message: `もっと小さいカードがないか「j」を使って探すよ。今の最小 (hairetsu[minIndex]) と hairetsu[j] を比べるね。`,
                variables: { k, minIndex: minIdx, j },
                codeLine: 4
            };

            if (cards[j].value < cards[minIdx].value) {
                minIdx = j;
                yield {
                    type: 'select',
                    indices: [minIdx],
                    message: `もっと小さいカード ${cards[minIdx].value} を見つけたよ！「minIndex」を ${j} に書き換えて覚えなおそう。`,
                    variables: { k, minIndex: minIdx },
                    codeLine: 5
                };
            }
        }

        if (minIdx !== k) {
            yield {
                type: 'swap',
                indexA: k,
                indexB: minIdx,
                message: `一番小さかった hairetsu[${minIdx}] と、今の場所 [${k}] をSWAP（入れ替え）て確定させるよ。`,
                variables: { k, minIndex: minIdx },
                codeLine: 8
            };
            [cards[k], cards[minIdx]] = [cards[minIdx], cards[k]];
        }

        yield {
            type: 'sorted',
            indices: [k],
            message: `これで hairetsu[${k}] の場所が最小のカードで決まったね。`,
            variables: { k },
            codeLine: 9
        };
    }

    yield {
        type: 'sorted',
        indices: Array.from({ length: n }, (_, i) => i + 1),
        message: `全部のカードが正しい順番に並んだよ！`,
        variables: {},
        codeLine: 1
    };
}
