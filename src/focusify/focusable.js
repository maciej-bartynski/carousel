import React, { Component } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
import focused from './focused.js';

const focusify = WrappedComponent => {
    class FocusDetection extends Component {
        constructor(props) {
            super(props);
            this.isVisible = false;
            this.exitFromView = this.exitFromView.bind(this);
            this.enterIntoView = this.enterIntoView.bind(this);
            this.progressInView = this.progressInView.bind(this);
            this.onClickHandler = this.onClickHandler.bind(this);
            this.markupReference = React.createRef();
            this.keyboardHandler = this.verticalNavigation.bind(this);
            this.focusifyEndHandler = this.focusifyEndHandler.bind(this);
            this.focusifyStartHandler = this.focusifyStartHandler.bind(this);
            this.arrowNavigationLock = false;
            this.__focusify__ENABLE__arrowNavigation = this.__focusify__ENABLE__arrowNavigation.bind(
                this
            );
            this.__focusify__DISABLE__arrowNavigation = this.__focusify__DISABLE__arrowNavigation.bind(
                this
            );
        }

        __focusify__ENABLE__arrowNavigation() {
            this.arrowNavigationLock = true;
        }

        __focusify__DISABLE__arrowNavigation() {
            this.arrowNavigationLock = false;
        }

        focusifyStartHandler() {
            if (
                this.controlledChild &&
                this.controlledChild.__focusify__START__currentComponent
            ) {
                this.controlledChild.__focusify__START__currentComponent();
            }
        }

        focusifyEndHandler() {
            if (
                this.controlledChild &&
                this.controlledChild.__focusify__STOP__currentComponent
            ) {
                this.controlledChild.__focusify__STOP__currentComponent();
            }
        }

        enterIntoView() {
            focused.updateCurrent({
                component: this,
                importance: 1
            });

            this.isVisible = true;
        }

        exitFromView() {
            focused.updateCurrent({
                component: this,
                importance: 0
            });

            this.isVisible = false;
        }

        progressInView(e) {
            if (e.progress > 0.6 && e.progress < 0.8) {
                focused.updateCurrent({
                    component: this,
                    importance: 2
                });
            } else if (e.progress <= 0.6 || e.progress >= 0.8) {
                focused.updateCurrent({
                    component: this,
                    importance: 1
                });
            }
        }

        onClickHandler() {
            focused.updateCurrent({
                component: this,
                importance: 3
            });
        }

        verticalNavigation(e) {
            if (
                e.key === 'ArrowUp' ||
                (e.key === 'ArrowDown' && !this.arrowNavigationLock)
            ) {
                let all = focused.visibleComponents;
                let dir = e.key === 'ArrowUp' ? -1 : 1;
                for (let i = 0; i < all.length; i++) {
                    if (
                        focused.currentComponent.component ===
                            all[i].component &&
                        all[i + dir] &&
                        all[i + dir].component.isVisible
                    ) {
                        e.preventDefault();
                        focused.updateCurrent(all[i + dir]);
                        i = all.length;
                        break;
                    }
                }
                return;
            }
            this.controlledChild.__focusify__WHEN_CURRENT__keyboardHandler(e);
        }

        addMeToSensitiveComponents() {
            let arrowNav = {
                component: this,
                importance: 3
            };
            focused.pushToSensitiveComponents(arrowNav);
        }

        render() {
            let { ...restProps } = this.props;
            this.addMeToSensitiveComponents();
            return (
                <div ref={this.markupReference}>
                    <ScrollTrigger
                        onEnter={e => this.enterIntoView(e)}
                        onExit={e => this.exitFromView(e)}
                        onProgress={e => this.progressInView(e)}
                        onClick={e => this.onClickHandler(e)}
                    >
                        <WrappedComponent
                            {...restProps}
                            __focusify__SET_ME_AS__controlledComponent={context =>
                                (this.controlledChild = context)
                            }
                            __focusify__ENABLE__arrowNavigation={
                                this.__focusify__ENABLE__arrowNavigation
                            }
                            __focusify__DISABLE__arrowNavigation={
                                this.__focusify__DISABLE__arrowNavigation
                            }
                        />
                    </ScrollTrigger>
                </div>
            );
        }
    }

    return FocusDetection;
};

export default focusify;
