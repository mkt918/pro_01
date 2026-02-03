export function* insertionSort(cards) {
    let n = cards.length - 1;

    yield {
        type: 'info',
        message: `挿入ソートをはじめるよ。左から順番にきれいに並べていくね。`,
        variables: { n },
        codeLine: 1
    };

    yield {
        type: 'sorted',
        indices: [1],
        message: `最初の1枚 (hairetsu[1]) は並んでいると考えるよ。`,
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
            message: `このカード (${key.value}) を整列させたいから、一旦手元 (hozon) に持っておくね。`,
            variables: { k, hozon: key.value },
            codeLine: 3
        };

        while (j >= 1 && cards[j].value > key.value) {
            yield {
                type: 'compare',
                indices: [j, j + 1], // j+1 is effectively 'hole' or current compare spot
                message: `左のカード (${cards[j].value}) と 手元のカード (${key.value}) を比べるよ。左が大きい？`,
                variables: { j, hozon: key.value },
                codeLine: 5
            };

            yield {
                type: 'swap',
                indexA: j,
                indexB: j + 1,
                message: `左のほうが大きいね！右にずれてもらおう。`,
                variables: { j, jNext: j + 1 },
                codeLine: 6
            };

            [cards[j], cards[j + 1]] = [cards[j + 1], cards[j]];
            j = j - 1;
        }

        yield {
            type: 'from_hozon',
            index: j + 1,
            message: `ここなら入るね！手元のカード (${key.value}) を戻そう (挿入)`,
            variables: { j: j + 1, hozon: key.value },
            codeLine: 9
        };

        const sortedIndices = Array.from({ length: k }, (_, idx) => idx + 1);
        yield {
            type: 'sorted',
            indices: sortedIndices,
            message: `ここまで (aaa[1]～aaa[${k}]) はきれいに並んだよ！`,
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
        message: `全部の並び替えが終わったよ！ (完了)`,
        variables: {},
        codeLine: 11
    };
}
