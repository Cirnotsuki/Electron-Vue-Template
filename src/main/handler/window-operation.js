/* 窗口操作
    attr: 属性设置
    fn: 调用方法
    res: 返回属性

    {
        attr: [
            {
                name: 'resizable',
                value: true,
            },
        ],
        fn: [
            {
                name: 'setSize',
                params: [1100, 650],
            }
        ],
        res: [
            {
                name: 'isMaximized',
                type: 'attr' || 'fn'
            }
        ]
    }
*/

export default function winOperation(broWin, event, args) {
    const curWin = broWin.fromWebContents(event.sender);
    if (!curWin) return;

    if (args.attr && args.attr.length) {
        for (const prop of args.attr) {
            curWin[prop.name] = prop.value;
        }
    }

    if (args.fn && args.fn.length) {
        for (const fn of args.fn) {
            Array.isArray(fn.params) ? curWin[fn.name](...fn.params) : curWin[fn.name](fn.params);
        }
    }

    const result = {};
    if (args.res && args.res.length) {
        for (const attr of args.res) {
            result[attr.name] = attr.type === 'fn' ? curWin[attr.name]() : curWin[attr.name];
        }
    }
    return result;
}
