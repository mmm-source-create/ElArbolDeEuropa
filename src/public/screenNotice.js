export const SCREEN_NOTICE_KEY = 'eade:screen-notice-dismissed';
// El hash de este texto se autoriza en la CSP; mantenerlo idéntico al HTML.
export const SCREEN_NOTICE_SCRIPT = `try{if(sessionStorage.getItem("${SCREEN_NOTICE_KEY}")==="1")document.documentElement.dataset.eadeScreenNotice="dismissed"}catch{}`;
