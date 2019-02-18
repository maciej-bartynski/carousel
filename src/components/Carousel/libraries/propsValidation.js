let propsValidation = {};

propsValidation.leftOverflow = (allSliders) => {
    let operationOnSliders = allSliders.slice();
    return operationOnSliders.sort((a, b) => {
        return a.columns - b.columns;
    })[0].columns;
}

propsValidation.maxRightPosition = (allSliders) => {
    let operationOnSliders = allSliders.slice();
    operationOnSliders.sort((a, b) => {
        return b.columns - a.columns;
    }); 
   
    return operationOnSliders[0].items.length - operationOnSliders[0].columns;
}

propsValidation.isSlider = (items, columns, rows) => {
    //let isSlider = items.length > (columns * rows) ? true : false;
    return true//isSlider;
}

propsValidation.isInfinite = (sliders, rows, isInfinite) => {
    let validInfinity = false;
    sliders.forEach((slider)=>{
        if(slider.items.length > slider.columns * rows){
            if(isInfinite === true){
                validInfinity = true;
            } 
        }
    })
    return validInfinity;
}


export { propsValidation };