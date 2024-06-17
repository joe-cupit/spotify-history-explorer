import json

with open('exampledata.json', 'r') as f:
    songs = json.load(f)

for song in songs:
    title = song['master_metadata_track_name']
    artist = song['master_metadata_album_artist_name']
    skipped = song['skipped']

    if skipped:
        print('(skipped) ', end='')
    print(f'{title} - {artist}')

