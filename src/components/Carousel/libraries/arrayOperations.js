let arrayOperations = {};

arrayOperations.itemsAmountValidator = (items, visibleColumns, rowsAmount, minFullViewsAmount) => {
    /**
     * no infinity or no slider
     */
    if (minFullViewsAmount !== 3) return items;

    let gridCellsAmount = visibleColumns * rowsAmount * minFullViewsAmount;

    /**
     * edition not required
     */
    if (items.length >= gridCellsAmount) return items;
   
    /**
     * edit array to provide
     * enough items for slide 
     */
    let diff = gridCellsAmount - items.length;
    while (items.length < gridCellsAmount) {
        items = items.concat(items.slice(0, diff));
    }
    return items;
}

arrayOperations.columnsArrayCreator = (items, rowsAmount) => {
    let validColumns = [];
    let i = 0;

    while (i < items.length) {
        let singleColumn = (items.slice(i, i + rowsAmount));
        validColumns.push(singleColumn);
        i += rowsAmount;
    }

    return validColumns;
}

arrayOperations.columnsArrayRebuild = (items, sliceIndex) => {
    let head = items.slice(sliceIndex);
    let tail = items.slice(0, sliceIndex);
    return head.concat(tail);
}

export { arrayOperations };