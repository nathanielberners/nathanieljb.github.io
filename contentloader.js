// Content loader - Load content from external HTML files in to mian webpage
document.addEventListener( 'DOMContentLoaded', () => {
    function    loadExternalHTML( url, targetElementID ) {
        fetch( url )
        .then( response => {
            if( !response.ok ) {
                throw new Error( `HTTP error! status: ${response.status}` );
            }
            return response.text();
        })
        .then( html => {
            document.getElementById( targetElementID ).innerHTML = html;
        })
        .catch( error => {
            console.error( 'Error loading external HTML:' error );
        });
    }

    loadExternalHTML( 'test.html', 'content' );
});
