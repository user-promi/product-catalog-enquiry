import React, { useState, useEffect } from 'react';
import { __ } from "@wordpress/i18n";
import Intro from './steps/Intro';
import Modules from './steps/Module';
import Enquiry from './steps/Enquiry';
import Quote from './steps/Quote';
import Wholesale from './steps/Wholesale';

const SetupWizard = () => {

	const [currentStep, setCurrentStep] = useState(0);
	const onPrev = () => {
		setCurrentStep(Math.max(0, (currentStep - 1) ));
	}

	const onNext = () => {
		setCurrentStep(currentStep + 1);
	}

	const onFinish = () => {
		console.log('finishh');
		console.log(appLocalizer.redirect_url);

		window.location.href = appLocalizer.redirect_url
	}

    const steps = [
        { component: <Intro onNext={onNext}/>, title: 'Intro' },
        { component: <Modules onPrev={onPrev} onNext={onNext}/>, title: 'Modules' },
        { component: <Enquiry onPrev={onPrev} onNext={onNext}/>, title: 'Enquiry' },
        { component: <Quote onPrev={onPrev} onNext={onNext}/>, title: 'Quote' },
        { component: <Wholesale onPrev={onPrev} onFinish={onFinish}/>, title: 'Wholesale' },
    ];


	return (
		<>
		<div>
            <h1>Setup Wizard</h1>
            <div>{steps[currentStep].component}</div>
        </div>
		</>

	);
}
export default SetupWizard;