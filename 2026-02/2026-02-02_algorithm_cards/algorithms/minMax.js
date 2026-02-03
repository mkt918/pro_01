export function* findMinMax(cards) {
    let n = cards.length - 1;
    let maxIndex = 1;
    let maxValue = cards[1].value;
    let minIndex = 1;
    let minValue = cards[1].value;

    yield {
        type: 'info',
        message: `最大値と最小値を同時に探すよ。まずは最初の1枚に注目！`,
        variables: { max: maxValue, min: minValue },
        codeLine: 1
    };

    yield {
        type: 'to_max',
        index: 1,
        message: `とりあえず、これを最大値 (Max) にしておこう。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 2
    };

    yield {
        type: 'to_min',
        index: 1,
        message: `最小値 (Min) もこれにしておくね。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 2
    };

    for (let k = 2; k <= n; k++) {
        yield {
            type: 'compare',
            indices: [k],
            message: `hairetsu[${k}] (${cards[k].value}) を見てみよう。最大や最小よりすごいかな？`,
            variables: { k, max: maxValue, min: minValue, current: cards[k].value },
            codeLine: 3 // Loop / Initial check
        };
        // Also highlight comparison? Maybe 4 inside?
        // Let's stick to 3 for loop Start, and if specific logic hits, highlight specific line.

        if (cards[k].value > maxValue) {
            // Check Max
            yield {
                type: 'info',
                message: `${cards[k].value} は今の最大 (${maxValue}) より大きいね！`,
                variables: { k, max: maxValue },
                codeLine: 4
            };

            maxValue = cards[k].value;
            maxIndex = k;
            yield {
                type: 'to_max',
                index: k,
                message: `最大値を更新！新しい Max = ${maxValue}`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 5
            };
        } else if (cards[k].value < minValue) {
            // Check Min
            // Note: In minMax.js original logic, it was else if.
            // If > Max, it can't be < Min (unless start, but logic holds).
            yield {
                type: 'info',
                message: `${cards[k].value} は今の最小 (${minValue}) より小さいね！`,
                variables: { k, min: minValue },
                codeLine: 6
            };

            minValue = cards[k].value;
            minIndex = k;
            yield {
                type: 'to_min',
                index: k,
                message: `最小値を更新！新しい Min = ${minValue}`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 7
            };
        }
    }

    yield {
        type: 'info',
        message: `全部見終わったよ！最大は ${maxValue}、最小は ${minValue} だね。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 9
    };
}
