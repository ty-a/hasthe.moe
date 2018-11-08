/* More or less shamelessly copied from
https://getuikit.com/docs/upload with slight differences 
*/
var bar = document.getElementById('js-progressbar');

UIkit.upload('.js-upload', {

    url: '/upload',
    name: 'file',
    multiple: true,
    mime: 'image/*',

    beforeSend: function (environment) {
        console.log('beforeSend');
        console.log(arguments);

        // The environment object can still be modified here.
        // var {data, method, headers, xhr, responseType} = environment;

    },
    beforeAll: function () {
        console.log('beforeAll', arguments);
    },
    load: function () {
        console.log('load', arguments);
    },
    error: function () {
        console.log('error', arguments);
    },
    complete: function () {
        console.log('complete', arguments);
    },

    loadStart: function (e) {
        console.log('loadStart', arguments);

        bar.removeAttribute('hidden');
        bar.max = e.total;
        bar.value = e.loaded;
    },

    progress: function (e) {
        console.log('progress', arguments);

        bar.max = e.total;
        bar.value = e.loaded;
    },

    loadEnd: function (e) {
        console.log('loadEnd', arguments);

        bar.max = e.total;
        bar.value = e.loaded;
    },

    completeAll: function () {
        console.log('completeAll', arguments);
        console.log(arguments[0].responseText)
        var resp = JSON.parse(arguments[0].responseText);

        if(resp.status) {
          document.getElementById('image-link').setAttribute('href', resp.link);
          document.getElementById('status').setAttribute('class', 'uk-alert-success')
          document.getElementById('image-link').removeAttribute('hidden');
        } else {
          document.getElementById('error-p').text(resp.reason);
          document.getElementById('error-p').removeAttribute('hidden');
        }

        setTimeout(function () {
            bar.setAttribute('hidden', 'hidden');
        }, 1000);

        //alert('Upload Completed');
    }

});
