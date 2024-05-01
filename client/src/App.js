import React, { useEffect, useState } from 'react';
import { getImages, searchImages } from './api';
import { FaHeart, FaThumbtack } from 'react-icons/fa'; // Importing Font Awesome icons
import './App.css';

const App = () => {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [zoomedImageIndex, setZoomedImageIndex] = useState(null); // State to keep track of zoomed image
  const [likedImages, setLikedImages] = useState({}); // State to keep track of liked images

  useEffect(() => {
    const fetchData = async () => {
      const responseJson = await getImages();
      setImageList(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    };

    fetchData();
  }, []);

  const handleLoadMoreButtonClick = async () => {
    const responseJson = await getImages(nextCursor);
    setImageList((currentImageList) => [...currentImageList, ...responseJson.resources]);
    setNextCursor(responseJson.next_cursor);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const responseJson = await searchImages(searchValue, nextCursor);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  };

  const resetForm = async () => {
    const responseJson = await getImages();
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
    setSearchValue('');
  };

  const handlePinButtonClick = (index) => {
    setZoomedImageIndex(index === zoomedImageIndex ? null : index); // Toggle zoom effect
  };

  const handleLikeButtonClick = (publicId) => {
    setLikedImages((prevLikedImages) => ({
      ...prevLikedImages,
      [publicId]: !prevLikedImages[publicId],
    }));
  };

  return (
    <>
      <h1 className='pinterest-heading'>Pinterest</h1>
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          required='required'
          placeholder='Search Images...'
        />
        <button type='submit'>Search</button>
        <button type='button' onClick={resetForm}>
          Clear
        </button>
      </form>
      <div className='image-grid'>
        {imageList.map((image, index) => (
          <div className={`image-item ${index === zoomedImageIndex ? 'zoomed' : ''}`} key={image.public_id}>
            <img src={image.url} alt={image.public_id} />
            <div className='image-overlay'>
              <button className={`like-button ${likedImages[image.public_id] ? 'liked' : ''}`} onClick={() => handleLikeButtonClick(image.public_id)}>
                <FaHeart /> {/* Font Awesome heart icon */}
              </button>
              <button className='pin-button' onClick={() => handlePinButtonClick(index)}>
                <FaThumbtack /> {/* Font Awesome thumbtack icon */}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className='footer'>{nextCursor && <button onClick={handleLoadMoreButtonClick}>Load </button>}</div>
    </>
  );
};

export default App;
