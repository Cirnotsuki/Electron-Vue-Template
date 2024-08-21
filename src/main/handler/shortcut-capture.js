import { desktopCapturer, screen } from 'electron';

export default function getDesktopCapturer() {
    const PrimaryDisplay = screen.getPrimaryDisplay();
    const { scaleFactor } = PrimaryDisplay;
    const { width, height } = PrimaryDisplay.bounds;
    let count = 0;
    function getSources(suc, err) {
        const params = {
            types: ['screen'], // 屏幕
            thumbnailSize: {
                width: width * scaleFactor,
                height: height * scaleFactor,
            },
        };
        desktopCapturer.getSources(params).then(res => {
            const sources = res[0].thumbnail.toDataURL({ scaleFactor });
            suc(sources);
        }).catch(error => {
            count++;
            count < 3 ? getSources(suc, err) : err(error);
        });
    }

    return new Promise((resolve, reject) => {
        getSources((sources) => {
            resolve(sources);
        }, err => {
            reject(err);
        });
    });
}
