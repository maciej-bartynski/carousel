let propsValidation = {};

propsValidation.isSlider = (items, columns, rows) => {
    let isSlider = items.length > (columns * rows) ? true : false;
    return isSlider;
}

propsValidation.isInfinite = (isSlider, isInfinite) => {
    isInfinite = isInfinite && isSlider ? isInfinite : false;
    return isInfinite;
}


export { propsValidation };