// MusicPlayer.js
import React, { useEffect, useState } from 'react';
import { FaMusic, FaPlay, FaSearch } from 'react-icons/fa';

const FAVORITE_TRACKS = [
  { id: 'ejQ3TK-4-L4', title: 'Lofi hip hop - relax/study' },
  { id: 'Z2_iIYEZyJc', title: 'Summer Lofi Songs' },
  { id: 'LFmUU6MpyFs', title: 'The Scent Of The Summer' },
  // Add more favorite tracks as needed
];

export default function MusicPlayer({ colorGradients }) {
  const [videoId, setVideoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching && FAVORITE_TRACKS.length > 0) {
      setVideoId(FAVORITE_TRACKS[0].id);
    }
  }, [isSearching]);

  const handleFavoriteSelect = (id) => {
    setVideoId(id);
    setIsSearching(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setVideoId(searchTerm);
      // Remove this line to prevent going back to favorites tab
      // setIsSearching(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '500px',
        maxHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <button
          onClick={() => setIsSearching(false)}
          style={{
            padding: '5px',
            backgroundColor: !isSearching ? colorGradients[0] : 'white',
            color: !isSearching ? 'white' : 'black',
            border: 'none',
            borderRadius: '15px 0 0 15px',
            cursor: 'pointer',
            flex: 1,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaMusic style={{ marginRight: '3px' }} /> Favorites
        </button>
        <button
          onClick={() => setIsSearching(true)}
          style={{
            padding: '5px',
            backgroundColor: isSearching ? colorGradients[0] : 'white',
            color: isSearching ? 'white' : 'black',
            border: 'none',
            borderRadius: '0 15px 15px 0',
            cursor: 'pointer',
            flex: 1,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaSearch style={{ marginRight: '3px' }} /> Search
        </button>
      </div>

      {isSearching ? (
        <form onSubmit={handleSearch} style={{ marginBottom: '10px' }}>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search YouTube'
            style={{
              width: '100%',
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '15px',
              fontSize: '12px',
              outline: 'none',
            }}
          />
        </form>
      ) : (
        <div style={{ marginBottom: '10px', maxHeight: '100px', overflowY: 'auto' }}>
          {FAVORITE_TRACKS.map((track) => (
            <div
              key={track.id}
              onClick={() => handleFavoriteSelect(track.id)}
              style={{
                padding: '5px',
                margin: '3px 0',
                backgroundColor: videoId === track.id ? colorGradients[0] : 'white',
                color: videoId === track.id ? 'white' : 'black',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaPlay style={{ marginRight: '5px', fontSize: '10px' }} />
              {track.title}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {videoId ? (
          <iframe
            width='100%'
            height='100%'
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }}
          ></iframe>
        ) : (
          <div style={{ color: '#8f8f9d', fontSize: '12px', textAlign: 'center' }}>
            {isSearching ? 'Search for a YouTube video' : 'Select a favorite track'}
          </div>
        )}
      </div>
    </div>
  );
}
