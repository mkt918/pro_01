export function* insertionSort(cards) {
    let n = cards.length - 1;

    yield {
        type: 'info',
        message: `挿入ソート (1-based)。左から順に整列させていきます。`,
        variables: { n },
        codeLine: 1
    };

    yield {
        type: 'sorted',
        indices: [1],
        message: `aaa[1] はソート済みとします`,
        variables: {},
        codeLine: 3
    };

    // Use k for outer loop (current element to insert)
    for (let k = 2; k <= n; k++) {
        let key = cards[k]; // Store in hozon
        let j = k - 1;

        yield {
            type: 'to_hozon',
            index: k,
            value: key.value,
            message: `hozon = aaa[${k}] (${key.value}) を退避`,
            variables: { k, hozon: key.value },
            codeLine: 6
        };

        while (j >= 1 && cards[j].value > key.value) {
            yield {
                type: 'compare',
                indices: [j, j + 1], // j+1 is effectively 'hole' or current compare spot
                message: `比較: aaa[${j}](${cards[j].value}) > hozon(${key.value}) ?`,
                variables: { j, hozon: key.value },
                codeLine: 10
            };

            yield {
                type: 'swap',
                indexA: j,
                indexB: j + 1,
                message: `はい。aaa[${j}] を右へずらします (aaa[${j + 1}] = aaa[${j}])`,
                variables: { j, jNext: j + 1 },
                codeLine: 11
            };

            [cards[j], cards[j + 1]] = [cards[j + 1], cards[j]];
            j = j - 1;
        }

        yield {
            type: 'from_hozon',
            index: j + 1,
            message: `hozon (${key.value}) を aaa[${j + 1}] に戻します`,
            variables: { j: j + 1, hozon: key.value },
            codeLine: 14
        };

        const sortedIndices = Array.from({ length: k }, (_, idx) => idx + 1);
        yield {
            type: 'sorted',
            indices: sortedIndices,
            message: `aaa[1]～aaa[${k}] までソート完了`,
            variables: { k },
            codeLine: 16
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
        message: `ソート完了`,
        variables: {},
        codeLine: 20
    };
}
