export function* findMinMax(cards) {
    let n = cards.length - 1;
    let maxIndex = 1;
    let maxValue = cards[1].value;
    let minIndex = 1;
    let minValue = cards[1].value;

    yield {
        type: 'info',
        message: `最大・最小を同時に探します。まず aaa[1] (${maxValue}) を暫定的な最大・最小とします。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 1
    };

    yield {
        type: 'to_max',
        index: 1,
        message: `Max = aaa[1] (${maxValue})`,
        variables: { max: maxValue, min: minValue },
        codeLine: 2
    };

    yield {
        type: 'to_min',
        index: 1,
        message: `Min = aaa[1] (${minValue})`,
        variables: { max: maxValue, min: minValue },
        codeLine: 3
    };

    for (let k = 2; k <= n; k++) {
        yield {
            type: 'compare',
            indices: [k],
            message: `比較中: aaa[${k}] (${cards[k].value})`,
            variables: { k, max: maxValue, min: minValue, current: cards[k].value },
            codeLine: 5
        };

        if (cards[k].value > maxValue) {
            maxValue = cards[k].value;
            maxIndex = k;
            yield {
                type: 'to_max',
                index: k,
                message: `最大値更新！ Max = aaa[${k}] (${maxValue})`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 7
            };
        } else if (cards[k].value < minValue) {
            minValue = cards[k].value;
            minIndex = k;
            yield {
                type: 'to_min',
                index: k,
                message: `最小値更新！ Min = aaa[${k}] (${minValue})`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 9
            };
        }
    }

    yield {
        type: 'info',
        message: `探索完了！最大値は ${maxValue}、最小値は ${minValue} です。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 12
    };
}
