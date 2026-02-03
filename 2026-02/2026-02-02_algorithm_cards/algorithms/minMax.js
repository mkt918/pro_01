export function* findMinMax(cards) {
    let n = cards.length - 1;
    let maxIndex = 1;
    let maxValue = cards[1].value;
    let minIndex = 1;
    let minValue = cards[1].value;

    yield {
        type: 'info',
        message: `最大値と最小値を同時に探すよ。まずは最初の1枚に注目しよう！`,
        variables: { max: maxValue, min: minValue },
        codeLine: 1
    };

    yield {
        type: 'to_max',
        index: 1,
        message: `今のところ hairetsu[1] が一番大きいとして「Max」という箱に ${maxValue} を入れておくね。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 1
    };

    yield {
        type: 'to_min',
        index: 1,
        message: `同じように「Min」という箱にも ${minValue} を入れておくよ。これが基準になるよ。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 1
    };

    for (let k = 2; k <= n; k++) {
        yield {
            type: 'compare',
            indices: [k],
            message: `次のカード hairetsu[${k}] (${cards[k].value}) を見ていくよ。これは今の「Max」より大きいかな？それとも「Min」より小さいかな？`,
            variables: { k, max: maxValue, min: minValue, current: cards[k].value },
            codeLine: 2
        };
        // Also highlight comparison? Maybe 4 inside?
        // Let's stick to 3 for loop Start, and if specific logic hits, highlight specific line.

        if (cards[k].value > maxValue) {
            // Check Max
            yield {
                type: 'info',
                message: `今の最大値 ${maxValue} を超える ${cards[k].value} が見つかったよ！`,
                variables: { k, max: maxValue },
                codeLine: 3
            };

            maxValue = cards[k].value;
            maxIndex = k;
            yield {
                type: 'to_max',
                index: k,
                message: `「Max」の箱を新しい数字 ${maxValue} で書き換えよう。`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 4
            };
        } else if (cards[k].value < minValue) {
            // Check Min
            // Note: In minMax.js original logic, it was else if.
            // If > Max, it can't be < Min (unless start, but logic holds).
            yield {
                type: 'info',
                message: `今の最小値 ${minValue} よりも小さい ${cards[k].value} が見つかったよ！`,
                variables: { k, min: minValue },
                codeLine: 5
            };

            minValue = cards[k].value;
            minIndex = k;
            yield {
                type: 'to_min',
                index: k,
                message: `「Min」の箱を新しい数字 ${minValue} で書き換えよう。`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 6
            };
        }
    }

    yield {
        type: 'info',
        message: `全てのカードをチェックし終わったよ！「Max」に入っている ${maxValue} が最大、「Min」の ${minValue} が最小だね。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 1
    };
}
