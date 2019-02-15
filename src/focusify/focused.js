import keyboardListener from '../keyboardListener.js';

let keyboardSensitiveElements = {
    __potentialSensitiveComopnents: [],

    __currentSensitiveComponent: {
        component: null,
        importance: 0
    },

    get visibleComponents() {
        return this.__potentialSensitiveComopnents;
    },

    get currentComponent() {
        return this.__currentSensitiveComponent;
    },

    updateCurrent(payload) {
        if (!payload) return;

        this.__nextSensitiveComponent = this.__shouldBeUpdated(payload);

        if (
            this.__currentSensitiveComponent.component !=
            this.__nextSensitiveComponent.component
        ) {
            if (this.__currentSensitiveComponent.component != null)
                this.__currentSensitiveComponent.component.focusifyEndHandler();
        }

        if (this.__nextSensitiveComponent.component != null) {
            this.__nextSensitiveComponent.component.focusifyStartHandler();
        }
        if (this.__nextSensitiveComponent.component != null) {
            this.__currentSensitiveComponent = this.__nextSensitiveComponent;
            keyboardListener.setCurrentSensitiveElement = this.__currentSensitiveComponent.component;
        }
    },

    pushToSensitiveComponents(payload) {
        this.__potentialSensitiveComopnents.push(payload);
    },

    __shouldBeUpdated(payload) {
        if (payload.component === this.__currentSensitiveComponent.component) {
            if (this.__currentSensitiveComponent.importance === 3) {
                if (payload.importance === 0) {
                    return payload;
                }
            }
            if (payload.importance === 0) {
                return payload;
            }
            if (
                payload.importance <
                    this.__currentSensitiveComponent.importance &&
                this.__currentSensitiveComponent.importance !== 3
            ) {
                return payload;
            }
        }

        let prevImportance = this.__currentSensitiveComponent.importance;
        let nextImportance = payload.importance;

        if (nextImportance > prevImportance) {
            return payload;
        }

        if (nextImportance === 3) {
            return payload;
        }

        return this.__currentSensitiveComponent;
    }
};

export default keyboardSensitiveElements;
