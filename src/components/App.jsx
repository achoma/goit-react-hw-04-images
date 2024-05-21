import { useEffect } from 'react';

import { fetchGallery } from './fetchGallery';
import css from './App.module.css';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';
import { Loader } from './Loader/Loader';
import { useState } from 'react';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedImages, setSearchedImages] = useState('');
  const [totalHits, setTotalHits] = useState(0);
  const [disabledButton, setDisabledButton] = useState(true);
  const [images, setImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalSrc, setModalSrc] = useState('');

  useEffect(() => {
    if (!searchedImages) return;

    const fetchSearchedValue = async () => {
      setIsLoading(true);
      await fetchGallery(searchedImages, currentPage)
        .then(results => {
          if (results.hits.length < 12) {
            setImages(results.hits);
            setDisabledButton(true);
          } else if (currentPage === 1) {
            setDisabledButton(false);
            setImages(results.hits);
            setTotalHits(() => results.totalHits);
          } else {
            setImages(results.hits);
          }
        })
        .catch(e => {
          console.error(e);
        });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchSearchedValue();
  }, [searchedImages, currentPage]);

  const loadMore = () => {
    setCurrentPage(currentPage => currentPage + 1);
    setTotalHits(totalHits => totalHits - 12);
  };

  const handleValue = data => {
    setSearchedImages(data);
    setCurrentPage(1);
    setTotalHits(0);
  };

  const handleImageClick = image => {
    setOpenModal(true);
    setModalSrc(image.largeImageURL);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={css.app}>
      <Searchbar handleValue={handleValue} />
      <ImageGallery>
        {isLoading ? (
          <Loader />
        ) : (
          <ImageGalleryItem images={images} onClick={handleImageClick} />
        )}
      </ImageGallery>
      {totalHits !== 0 && (
        <Button disabled={disabledButton} onClick={loadMore} />
      )}
      {openModal && <Modal onClick={closeModal} openModal={modalSrc} />}
    </div>
  );
};
