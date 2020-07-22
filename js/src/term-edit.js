import initTabs from "./initializers/metabox-tabs";
import initTermScraper from "./initializers/term-scraper";
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import initEditorStore from "./initializers/editor-store";
import { termsTmceId } from "./lib/tinymce";
import initClassicEditorIntegration from "./initializers/classic-editor-integration";
import ClassicEditorData from "./analysis/classicEditorData";

// Backwards compatibility globals.
window.wpseoTermScraperL10n = window.wpseoScriptData.metabox;

// Initialize global admin scripts.
initAdmin( jQuery );

// Initialize the tab behavior of the metabox.
initTabs( jQuery );

// Initialize the editor store.
const store = initEditorStore();

// Initialize the ClassicEditor Integration.
initClassicEditorIntegration( store );

// Initialize classic editor data.
const editorData = new ClassicEditorData( () => {}, store, termsTmceId );
editorData.initialize( window.wpseoScriptData.analysis.plugins.replaceVars.replace_vars );

// Initialize the post scraper.
initTermScraper( jQuery, store, editorData );

// Initialize the media library for our social settings.
initAdminMedia( jQuery );
