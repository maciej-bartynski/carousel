const keyboardListener = {
    __currentKeyboardSensitiveElement: null,

    set setCurrentSensitiveElement(payload) {
        this.__currentKeyboardSensitiveElement = payload;
    },

    keyboardHandler(e) {
        if (this.__currentKeyboardSensitiveElement) {
            if (this.__currentKeyboardSensitiveElement.keyboardHandler) {
                this.__currentKeyboardSensitiveElement.keyboardHandler(e);
            }
        }
    }
};

document.addEventListener('keydown', e => {
    keyboardListener.keyboardHandler(e);
});

export default keyboardListener;
