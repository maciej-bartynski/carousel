export class RwdEnv {
    BREAKPOINTS = {
        // WIDESCREEN : infinity and beyond!
        DESKTOP: 1600,
        TABLET: 1100,
        MOBILE: 768
    };

    constructor(setEnv) {
        this.setEnv = setEnv;
        this.checkEnv();
        window.addEventListener('resize', this.checkEnv.bind(this));
    }

    checkEnv() {
        let type;
        if (window.innerWidth < this.BREAKPOINTS.MOBILE) {
            type = 'MOBILE';
        } else if (window.innerWidth < this.BREAKPOINTS.TABLET) {
            type = 'TABLET';
        } else if (window.innerWidth < this.BREAKPOINTS.DESKTOP) {
            type = 'DESKTOP';
        } else {
            type = 'WIDESCREEN';
        }
        this.setEnv(type);
    }
}
