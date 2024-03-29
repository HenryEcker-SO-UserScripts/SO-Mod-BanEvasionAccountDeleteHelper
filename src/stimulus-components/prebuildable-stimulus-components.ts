import {html_beautify} from 'js-beautify';

const ids = {
    modal: 'beadh-modal',
    mainAccountIdInput: 'beadh-main-account-id-input',
    deletionReason: 'beadh-delete-reason',
    deleteReasonDetails: 'beadh-delete-reason-details',
    annotationDetails: 'beadh-mod-menu-annotation',
    shouldMessageAfter: 'beadh-message-user-checkbox'
};
const data = {
    controller: 'beadh-form',
    target: {
        mainAccountIdInput: 'main-account-id',
        mainAccountIdInputButton: 'main-account-id-button',
        formElements: 'form-elements',
        deletionReasonSelect: 'delete-reason',
        deletionDetails: 'delete-reason-detail-text',
        annotationDetails: 'annotation-detail-text',
        shouldMessageAfter: 'message-user-checkbox',
        controllerSubmitButton: 'submit-actions-button'
    },
    action: {
        handleLookupMainAccount: 'handleLookupMainAccount',
        handleSubmitActions: 'handleSubmitActions',
        handleCancelActions: 'handleCancelActions'
    }
};

const supportedDeleteOptions = {
    'Ban evasion': 'This user was created to circumvent system or moderator imposed restrictions and continues to contribute poorly',
    'No longer welcome': 'This user is no longer welcome to participate on the site'
};


function convertKeyToTargetAccessor(s: string) {
    return `${s}Target`;
}


const initialModal = `
<aside class="s-modal s-modal__danger" id="${ids.modal}" tabindex="-1" role="dialog" aria-hidden="false" data-controller="s-modal" data-s-modal-target="modal">
    <div class="s-modal--dialog" style="width: max-content; max-width: 65vw;" role="document" data-controller="${data.controller} se-draggable">
        <h1 class="s-modal--header c-move" data-se-draggable-target="handle">Delete Ban Evasion Account</h1>
        <div class="s-modal--body">
            <div class="d-flex fd-column g12 mx8" data-${data.controller}-target="${data.target.formElements}">
                <div class="d-flex fd-row g4 jc-space-between ai-center">
                    <label class="s-label" for="${ids.mainAccountIdInput}" style="min-width:fit-content;">Enter ID For Main Account: </label>
                    <input data-${data.controller}-target="${data.target.mainAccountIdInput}" class="s-input" type="number" id="${ids.mainAccountIdInput}">
                    <button data-${data.controller}-target="${data.target.mainAccountIdInputButton}" class="s-btn s-btn__primary" type="button" style="min-width:max-content;" data-action="${data.controller}#${data.action.handleLookupMainAccount}">Resolve User URL</button>
                </div>
            </div>
        </div>
        <div class="d-flex gx8 s-modal--footer">
            <button class="s-btn flex--item s-btn__filled s-btn__danger" type="button" data-${data.controller}-target="${data.target.controllerSubmitButton}" data-action="click->${data.controller}#${data.action.handleSubmitActions}" disabled>Delete and Annotate</button>
            <button class="s-btn flex--item s-btn__muted" type="button" data-action="click->${data.controller}#${data.action.handleCancelActions}">Cancel</button>
        </div>
        <button class="s-modal--close s-btn s-btn__muted" type="button" aria-label="Close" data-action="s-modal#hide"><svg aria-hidden="true" class="svg-icon iconClearSm" width="14" height="14" viewBox="0 0 14 14"><path d="M12 3.41 10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7 12 3.41Z"></path></svg></button>
    </div>
</aside>`;


type LabelStatus = 'Optional' | 'Required' | 'New' | 'Beta';

interface LabelConfig {
    htmlFor: string;
    text: string;
    status?: LabelStatus;
    description?: string;
}

interface TextareaConfig {
    id: string;
    rows: number;
    name: string;
    placeholder: string;
    dataTarget: string;
}

function buildLabelStatus(status?: LabelStatus) {
    switch (status) {
        case 'Optional':
            return ' <span class="s-label--status">Optional</span>';
        case'Required':
            return ' <span class="s-label--status s-label--status__required">Required</span>';
        case 'New':
            return ' <span class="s-label--status s-label--status__new">New</span>';
        case 'Beta':
            return ' <span class="s-label--status s-label--status__beta">Beta</span>';
        default:
            return '';
    }
}

function buildLabel(labelConfig: LabelConfig) {
    return `<label class="s-label flex--item" for="${labelConfig.htmlFor}">${labelConfig.text}${buildLabelStatus(labelConfig.status)}${labelConfig.description === undefined ? '' : `<p class="s-description mt2">${labelConfig.description}</p>`}</label>`;
}

function buildTextarea(
    labelConfig: LabelConfig,
    textareaConfig: TextareaConfig
) {
    return `
<div class="d-flex ff-column-nowrap gs4 gsy">
    ${buildLabel(labelConfig)}
    <textarea style="font-family:monospace" class="flex--item s-textarea" id="${textareaConfig.id}" name="${textareaConfig.name}" placeholder="${textareaConfig.placeholder}" rows="${textareaConfig.rows}" data-${data.controller}-target="${textareaConfig.dataTarget}"></textarea>
    <span class="text-counter"></span>
</div>
`.trim();
}

const markdownNotSupportedMessage = '<span class="fw-bold">Reminder</span>: Markdown is not supported!';

const remainingFormFields = `
<div class="d-flex gy4 fd-column">
    ${buildLabel({htmlFor: ids.deletionReason, text: 'Reason for deleting this user'})}
    <div class="flex--item s-select">
        <select id="${ids.deletionReason}" data-${data.controller}-target="${data.target.deletionReasonSelect}">${
    // Programatically build options from supported list
    Object.entries(supportedDeleteOptions)
        .map(([label, value]) => {
            return `<option value="${value}">${label}</option>`;
        })
        .join('')
}</select>
    </div>
</div>
${buildTextarea(
    {
        htmlFor: ids.deleteReasonDetails,
        text: 'Please provide details leading to the deletion of this account',
        status: 'Required',
        description: markdownNotSupportedMessage
    },
    {
        id: ids.deleteReasonDetails,
        name: 'deleteReasonDetails',
        placeholder: 'Please provide at least a brief explanation of what this user has done; this will be logged with the action and may need to be referenced later.',
        rows: 6,
        dataTarget: data.target.deletionDetails
    }
)}
${buildTextarea(
    {
        htmlFor: ids.annotationDetails,
        text: 'Annotate the main account',
        status: 'Required',
        description: markdownNotSupportedMessage
    },
    {
        id: ids.annotationDetails,
        name: 'annotation',
        placeholder: 'Examples: &quot;possible sock of /users/XXXX, see mod room [link] for discussion&quot; or &quot;left a series of abusive comments, suspend on next occurrence&quot;',
        rows: 4,
        dataTarget: data.target.annotationDetails
    }
)}
<div class="d-flex fd-row">
    <div class="s-check-control">
        <input id="${ids.shouldMessageAfter}" class="s-checkbox" type="checkbox" checked data-${data.controller}-target="${data.target.shouldMessageAfter}">
        ${buildLabel({htmlFor: ids.shouldMessageAfter, text: 'Open message user in new tab', status: 'Optional'})}
    </div>
</div>`;

const htmlBeautifyConfig = {preserve_newlines: false};
export default {
    // HTML
    JS_MODAL_ID: JSON.stringify(ids.modal),
    INITIAL_MODAL_HTML: `\`\n${html_beautify(initialModal, htmlBeautifyConfig)}\``,
    MODAL_FORM_HTML: `\`\n${html_beautify(remainingFormFields, htmlBeautifyConfig)}\``,
    // STIMULUS DATA CONTROLLER STRINGS
    DATA_CONTROLLER: JSON.stringify(data.controller),
    CONTROLLER_TARGETS: JSON.stringify(Object.values(data.target)), // <- string[] not string!!
    //     - DATA CONTROLLER TARGETS
    MAIN_ACCOUNT_ID_INPUT_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.mainAccountIdInput)),
    MAIN_ACCOUNT_ID_INPUT_BUTTON_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.mainAccountIdInputButton)),
    FORM_ELEMENTS_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.formElements)),
    DELETION_REASON_SELECT_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.deletionReasonSelect)),
    DELETION_DETAILS_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.deletionDetails)),
    ANNOTATION_DETAILS_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.annotationDetails)),
    SHOULD_MESSAGE_AFTER_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.shouldMessageAfter)),
    CONTROLLER_SUBMIT_BUTTON_TARGET: JSON.stringify(convertKeyToTargetAccessor(data.target.controllerSubmitButton)),

    // String Replacement of function name (not in vite-define.d.ts)
    HANDLE_SUBMIT_ACTION: data.action.handleSubmitActions,
    HANDLE_CANCEL_ACTION: data.action.handleCancelActions,
    HANDLE_LOOKUP_MAIN_ACCOUNT: data.action.handleLookupMainAccount,
};

