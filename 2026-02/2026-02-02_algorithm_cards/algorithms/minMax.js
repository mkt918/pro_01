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
            message: `次のカード hairetsu[${k}] (${cards[k].value}) を見ていくよ。これは今の「Max」より大きいかな？`,
            variables: { k, max: maxValue, min: minValue, current: cards[k].value },
            codeLine: 2 // FOR
        };

        yield {
            type: 'compare',
            indices: [k],
            message: `hairetsu[${k}] (${cards[k].value}) は Max (${maxValue}) より大きいかな？`,
            variables: { k, max: maxValue, min: minValue },
            codeLine: 3 // IF (> Max)
        };

        if (cards[k].value > maxValue) {
            maxValue = cards[k].value;
            maxIndex = k;
            yield {
                type: 'to_max',
                index: k,
                message: `Max を超えるカードが見つかったので、「Max」の箱を ${maxValue} で書き換えよう。`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 4 // SET Max
            };
        } else {
            yield {
                type: 'compare',
                indices: [k],
                message: `Max より大きくはなかったね。次は Min (${minValue}) より小さいか確認してみよう。`,
                variables: { k, max: maxValue, min: minValue },
                codeLine: 5 // ELSE IF (< Min)
            };

            if (cards[k].value < minValue) {
                minValue = cards[k].value;
                minIndex = k;
                yield {
                    type: 'to_min',
                    index: k,
                    message: `今の最小値よりも小さいカードが見つかったので、「Min」を ${minValue} に更新しよう。`,
                    variables: { k, max: maxValue, min: minValue },
                    codeLine: 6 // SET Min
                };
            }
        }
    }

    yield {
        type: 'info',
        message: `全てのカードをチェックし終わったよ！「Max」に入っている ${maxValue} が最大、「Min」の ${minValue} が最小だね。`,
        variables: { max: maxValue, min: minValue },
        codeLine: 1
    };
}
