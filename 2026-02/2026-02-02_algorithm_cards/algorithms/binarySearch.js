export function* binarySearch(cards, targetValue) {
    yield {
        type: 'info',
        message: `二分探索をはじめるよ。探す範囲の左端を「k_low」、右端を「k_high」という箱に入れておくよ。最初は 1 から 13 までだね。`,
        variables: { target: targetValue, k_low: 1, k_high: cards.length - 1 },
        codeLine: 1
    };

    let k_low = 1;
    let k_high = cards.length - 1;

    while (k_low <= k_high) {
        const k_mid = Math.floor((k_low + k_high) / 2);

        yield {
            type: 'compare',
            indices: [k_low, k_high, k_mid],
            message: `範囲の真ん中の位置を計算して「k_mid」に ${k_mid} を代入したよ。これで真ん中のカードを確認できるね。`,
            variables: { k_low, k_high, k_mid, midValue: cards[k_mid].value, target: targetValue },
            codeLine: 3
        };

        const midValue = cards[k_mid].value;

        yield {
            type: 'compare',
            indices: [k_mid],
            message: `hairetsu[mid] (${midValue}) は target (${targetValue}) と同じかな？`,
            variables: { k_low, k_high, k_mid, midValue, target: targetValue },
            codeLine: 4 // IF (==)
        };

        if (midValue === targetValue) {
            yield {
                type: 'to_foundAt',
                index: k_mid,
                message: `真ん中のカードが target と同じだった！見つけた場所 ${k_mid} を foundAt に記録して終了しよう。`,
                variables: { foundAt: k_mid },
                codeLine: 5
            };

            yield {
                type: 'found',
                indices: [k_mid],
                message: `やったね！ ${targetValue} を発見しました！`,
                variables: { foundAt: k_mid },
                codeLine: 5
            };
            return;
        }

        yield {
            type: 'compare',
            indices: [k_mid],
            message: `hairetsu[mid] (${midValue}) は target (${targetValue}) より小さいかな？`,
            variables: { k_low, k_high, k_mid, midValue, target: targetValue },
            codeLine: 6 // ELSE IF (<)
        };

        if (midValue < targetValue) {
            yield {
                type: 'info',
                message: `真ん中のカード (${midValue}) は target (${targetValue}) より小さいね。もっと右側を探すために、左端の位置「k_low」を ${k_mid + 1} に更新しよう。`,
                variables: { k_low: k_mid + 1, k_high },
                codeLine: 7 // SET k_low
            };
            k_low = k_mid + 1;
        } else {
            yield {
                type: 'info',
                message: `ここまでの判定に当てはまらなかったので、真ん中のカード (${midValue}) は target (${targetValue}) より大きいということだね。`,
                variables: { k_low, k_high, k_mid, midValue, target: targetValue },
                codeLine: 8 // ELSE
            };
            yield {
                type: 'info',
                message: `もっと左側を探すために、右端の位置「k_high」を ${k_mid - 1} に更新しよう。`,
                variables: { k_low, k_high: k_mid - 1 },
                codeLine: 9 // SET k_high
            };
            k_high = k_mid - 1;
        }
    }

    yield {
        type: 'info',
        message: `「k_low」が「k_high」を追い越してしまったね。これは範囲の中に target が存在しないということだよ。`,
        variables: { found: false },
        codeLine: 11
    };
}
