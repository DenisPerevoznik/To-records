import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import { useHttp } from '../hooks/http.hook';
import '../resources/css/styles.css';

export const SelectImage = ({imagesType, imageChange, isFullScreen = false, selectedImage = null}) => {

    const [selectedImg, setSelectedImg] = useState('');
    const [images, setImages] = useState([]);
    const [imgLoader, setImgLoader] = useState(true);
    const auth = useContext(AuthContext);
    const {addToast} = useToasts();
    const {request} = useHttp();
    

    useEffect(() => {

        getImages();
    }, []);

    const getImages = async () => {
        try {
                
            setImgLoader(true);
    
            const images = await request(`/api/notepad/backgrounds/${imagesType}`, "GET", null, 
                {Authorization: `Bearer ${auth.token}`});
            
            setImages(images);
            
            if(!selectedImage){

                imageChange(images[0]);
                setSelectedImg(images[0]);
            }
            else{
                setSelectedImg(selectedImage);
            }
    
            setImgLoader(false);
            
        } catch (error) {
            
          addToast(error.message, {appearance: "error", autoDismiss: true});
        }
    }

    const selectElement = (event) => {
        
        const img = event.target.dataset.path;

        setSelectedImg(img);
        imageChange(img);
    }

    if(imgLoader){
        return (
        
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-grow text-primary" role="status">
                    <span className="sr-only">Images loading...</span>
                </div>
            </div>
        )
    }
    else{
        return (
        
            <div style={isFullScreen ? container : {...container, height: "115px"}} className="row">
                
                {images.map(image => <Element img={image} checked={selectedImg === image ? true : false} 
                    selectElement={selectElement} imagesType={imagesType}/>)}

            </div>
        )
    }
}

const Element = ({checked, img, selectElement, imagesType}) => {

    const [hovered, setHovered] = useState(false);

    return (
        <div onClick={selectElement} data-path={img} style={{ 
        backgroundImage: `url(${require(`../resources/images/${imagesType}/${img}`)})`, 
            opacity: hovered ? "0.7" : "1"}} onMouseEnter={() => {setHovered(true)}}
            onMouseLeave={() => {setHovered(false)}} className="col-2 selectImgBlock">
            {checked &&
            <div style={checkBackground} className="d-flex justify-content-center align-items-center">
                <i className="fas fa-check"/>
            </div>
        }
        </div>
    )
}

const container = {
    height: "177px",
    overflowY: "auto"
}

const checkBackground = {
    backgroundColor: "black",
    background: "rgba(0, 0, 0, 0.4)",
    color: "white",
    height: "100%"
}