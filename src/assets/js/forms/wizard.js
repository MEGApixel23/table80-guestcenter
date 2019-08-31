$(function () {
    if ($("#smartwizard-default").length) {
        $('#smartwizard-default').smartWizard({
            selected: 0, // INITIAL SELECTED STEP, 0 = FIRST STEP 
            keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            autoAdjustHeight: true, // AUTOMATICALLY ADJUST CONTENT HEIGHT
            cycleSteps: false, // ALLOWS TO CYCLE THE NAVIGATION OF STEPS
            BACKBUTTONSUPPORT: true, // ENABLE THE BACK BUTTON SUPPORT
            useURLhash: true, // ENABLE SELECTION OF THE STEP BASED ON URL HASH
            lang: { // LANGUAGE VARIABLES
                next: 'Next',
                previous: 'Previous'
            },
            toolbarSettings: {
                toolbarPosition: 'bottom', // NONE, TOP, BOTTOM, BOTH
                toolbarButtonPosition: 'right', // LEFT, RIGHT
                showNextButton: true, // SHOW/HIDE A NEXT BUTTON
                showPreviousButton: true // SHOW/HIDE A PREVIOUS BUTTON
            },
            anchorSettings: {
                anchorClickable: false, // ENABLE/DISABLE ANCHOR NAVIGATION
                enableAllAnchors: false, // ACTIVATES ALL ANCHORS CLICKABLE ALL TIMES
                markDoneStep: true, // ADD DONE CSS
                enableAnchorOnDoneStep: true // ENABLE/DISABLE THE DONE STEPS NAVIGATION
            },
            contentURL: null, // CONTENT URL, ENABLES AJAX CONTENT LOADING. CAN SET AS DATA DATA-CONTENT-URL ON ANCHOR
            disabledSteps: [], // ARRAY STEPS DISABLED
            errorSteps: [], // HIGHLIGHT STEP WITH ERRORS
            theme: 'default',
            transitionEffect: 'fade', // EFFECT ON NAVIGATION, NONE/SLIDE/FADE
            transitionSpeed: '0'
        });
    }

    if ($("#smartwizard-arrows").length) {
        $('#smartwizard-arrows').smartWizard({
            selected: 0, // Initial selected step, 0 = first step 
            keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            autoAdjustHeight: true, // Automatically adjust content height
            cycleSteps: false, // Allows to cycle the navigation of steps
            backButtonSupport: true, // Enable the back button support
            useURLhash: true, // Enable selection of the step based on url hash
            lang: { // Language variables
                next: 'Next',
                previous: 'Previous'
            },
            toolbarSettings: {
                toolbarPosition: 'bottom', // none, top, bottom, both
                toolbarButtonPosition: 'right', // left, right
                showNextButton: true, // show/hide a Next button
                showPreviousButton: true // show/hide a Previous button
            },
            anchorSettings: {
                anchorClickable: false, // Enable/Disable anchor navigation
                enableAllAnchors: false, // Activates all anchors clickable all times
                markDoneStep: true, // add done css
                enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
            },
            contentURL: null, // content url, Enables Ajax content loading. can set as data data-content-url on anchor
            disabledSteps: [], // Array Steps disabled
            errorSteps: [], // Highlight step with errors
            theme: 'arrows',
            transitionEffect: 'fade', // Effect on navigation, none/slide/fade
            transitionSpeed: '0'
        });
    }
});