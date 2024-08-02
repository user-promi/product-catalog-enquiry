import React from 'react';

const Intro = (props) => {
    const {onNext} = props;
    console.log(onNext)

    return (
        <div>
            <h2>Introduction</h2>
            <p>Welcome to the setup wizard. This is the intro step.</p>

            <div>
                <button onClick={onNext}>Next</button>
            </div>
        </div>
    );
};

export default Intro;
