export function* linearSearch(cards, targetValue) {
    // k is index for cards array (aaa)

    yield {
        type: 'info',
        message: `探したい数字を「target」という名前に決めたよ。まずは target に ${targetValue} を覚えさせよう。`,
        variables: { target: targetValue },
        codeLine: 1
    };

    for (let k = 1; k < cards.length; k++) {
        yield {
            type: 'compare',
            indices: [k],
            message: `「k」は今チェックしている番号だよ。今は hairetsu[${k}] のカードを見てみよう。`,
            variables: { k: k, value: cards[k].value, target: targetValue },
            codeLine: 2
        };

        if (cards[k].value === targetValue) {
            yield {
                type: 'to_foundAt',
                index: k,
                message: `target と同じ数字が見つかった！「foundAt」という箱に、見つけた場所「${k}」を記録するよ。`,
                variables: { k: k, found: true },
                codeLine: 4
            };

            yield {
                type: 'found',
                indices: [k],
                message: `これで探索終了！ ${targetValue} は ${k} 番目にあることがわかったね。`,
                variables: { k: k, found: true },
                codeLine: 4
            };
            return;
        }
    }

    yield {
        type: 'info',
        message: `「k」が 13 まで進んだけど見つからなかったね。target はここには無いみたいだ。`,
        variables: { found: false },
        codeLine: 7
    };
}
