enyo.kind({
    name: "FilesDetails",
    kind: enyo.Control,
    tag: "div",

    components: [
        { name: "noselected", content: "No torrent selected", showing: "no" },
        { name: "files", tag: "table", components: [
            { tag: "tr", components: [
                { tag: "th", content: "Name" },
                { tag: "th", content: "Size" },
                { tag: "th", content: "Downloaded" },
                { tag: "th", content: "Done" },
                { tag: "th", content: "Priority" }
            ] },
            { name: "tablebody", tag: "tbody"}
        ] }
    ],

    create: function() {
        this.inherited( arguments );

        this.update();
    },

    published: {
        torrent: null
    },

    handlers: {
        onUpdateTorrentDetails: "update"
    },

    update: function() {
        var torrent = enyo.application.getSelectedTorrents()[0];
        if( torrent !== undefined ) {
            this.$.noselected.hide();
            this.$.files.show();
            this.bubble( "onStartLoading" );
            new enyo.Ajax( { url: "php/rpcconnection.php", method: "post" } ).
                response( this, "gotFiles" ).
                go( { method: "getTorrentFiles", torrent: torrent } );
        } else {
            this.$.noselected.show();
            this.$.files.hide();
        }
    },

    gotFiles: function( sender, response ){
        this.bubble( "onStopLoading" );

        if ( response.success ) {
            var torrent = response.arguments.torrents[0];
            this.torrent = new Torrent( torrent );

            numFiles = this.torrent.getFiles().length;
            files = this.torrent.getFiles();
            fileStats = this.torrent.getFileStats();

            this.$.tablebody.destroyClientControls();
            for ( var i = 0; i < numFiles; ++i ) {
                this.$.tablebody.createComponent({
                    kind: "TorrentFile",
                    file: files[i],
                    fileStats: fileStats[i]
                });
            };

            this.render();
        } else {
            log( "Couldn't get the files of the torrent. Error: " + response.message );
        }

    }




});
