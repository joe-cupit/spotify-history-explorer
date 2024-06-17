import cherrypy
import os


PAGE = 'public/pages/'


class SpotifySite(object):

    def __init__(self):
        self.artist = ArtistPage()
        self.song = SongPage()

    @cherrypy.expose
    def index(self):
        return open(PAGE+'index.html')


@cherrypy.popargs('artist_id')
class ArtistPage(object):

    @cherrypy.expose
    def index(self, artist_id):
        page = open(PAGE+'artist.html')
        return page.read().format(artist_id=artist_id)


@cherrypy.popargs('song_id')
class SongPage(object):

    @cherrypy.expose
    def index(self, song_id):
        page = open(PAGE+'song.html')
        return page.read().format(song_id=song_id)


if __name__ == '__main__':
    config = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './public'
        }
    }

    cherrypy.quickstart(SpotifySite(), '/', config)
