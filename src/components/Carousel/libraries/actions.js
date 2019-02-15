import { validatedProps } from './../root';
import { stateClone } from './../root';

export let actions = {
    onButtonClick(dir){ console.log('clicked')
        let by = validatedProps.maxFullScreen;
        stateClone.animatableChangeState(dir, by);
    },
    onColumnClick(to){
        stateClone.animatableChangeState(false, false, to);
    }
}