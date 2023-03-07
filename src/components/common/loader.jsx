import React, { useState } from "react";

export const IsLoading = (WrappedComponent,loadingMsg) => {
    function HOC(props) {
        const [isLoading, setLoading] = useState(true);
        const setLoadingState = loading => {
            setLoading(loading)
        }

        return (
            <>
                {isLoading && <span>Loading....</span>}
                <WrappedComponent {...props} setLoading={setLoadingState} />
            </>
        )
    }
    return HOC;
}

export default IsLoading;