import styled from 'styled-components';

export default styled.div`
    .wrapper * {
        user-select: none!important;
    }
    
    .wrapper {
        width: 100%;
        overflow: hidden;
        position: relative;
        user-select: none;
    }
`;