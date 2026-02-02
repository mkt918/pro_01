export function* findMinMax(cards) {
    let maxIndex = 1;
    let maxValue = cards[1].value;

    yield {
        type: 'info',
        message: `最大値を探します。aaa[1] (値:${maxValue}) を暫定最大値とします。`,
        variables: { maxIndex, maxValue },
        codeLine: 1
    };

    yield {
        type: 'select',
        indices: [maxIndex],
        message: `暂定最大: aaa[${maxIndex}] = ${maxValue}`,
        variables: { maxIndex, maxValue },
        codeLine: 2
    };

    for (let k = 2; k < cards.length; k++) {
        yield {
            type: 'compare',
            indices: [maxIndex, k],
            message: `比較: 暫定最大(${maxValue}) vs aaa[${k}](${cards[k].value})`,
            variables: { maxIndex, maxValue, k: k, current: cards[k].value },
            codeLine: 4
        };

        if (cards[k].value > maxValue) {
            maxValue = cards[k].value;
            maxIndex = k;
            yield {
                type: 'select',
                indices: [maxIndex],
                message: `更新: 新しい最大値 ${maxValue} (場所: aaa[${maxIndex}])`,
                variables: { maxIndex, maxValue, k: k },
                codeLine: 6
            };
        }
    }

    yield {
        type: 'found',
        indices: [maxIndex],
        message: `探索終了。最大値は ${maxValue} (aaa[${maxIndex}]) です。`,
        variables: { maxIndex, maxValue },
        codeLine: 10
    };
}
