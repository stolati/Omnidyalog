// Import the page-mod API
var pageMod = require("sdk/page-mod");
var Self = require("sdk/self");

pageMod.PageMod({
    include: "*",
    contentScriptFile: Self.data.url('content.js')
});


// // Create a page-mod
// // It will run a script whenever a ".org" URL is loaded
// // The script replaces the page contents with a message
// pageMod.PageMod({
//   include: "*.org",
//   contentScriptFile: self_api.data.url("content.js")
// });

