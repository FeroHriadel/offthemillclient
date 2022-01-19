import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import Resizer from 'react-image-file-resizer';
import axios from 'axios'; //so you don't have to do formData. Axios somehow does it for you
import { useSelector } from 'react-redux';

/*
Resizer.imageFileResizer(
  file, // Is the file of the image which will resized.
  maxWidth, // Is the maxWidth of the resized new image.
  maxHeight, // Is the maxHeight of the resized new image.
  compressFormat, // Is the compressFormat of the resized new image.
  quality, // Is the quality of the resized new image.
  rotation, // Is the degree of clockwise rotation to apply to uploaded image.
  responseUriFunc, // Is the callBack function of the resized new image URI.
  outputType, // Is the output type of the resized new image.
  minWidth, // Is the minWidth of the resized new image.
  minHeight // Is the minHeight of the resized new image.
);
*/



const FileUpload = ({ values, setValues, setBgColor, setToastText, setShowToast, editingProduct = false, setImagesToDelete = null, imagesToDelete = [] }) => {
    //VALUES
    const user = useSelector(state => state.user);
    const [loader, setLoader] = useState(false);



    //UPLOAD IMG
    const resizeAndUpload = e => {
        const files = e.target.files;
        if (files) {
            setLoader(true);

            //length will always be 1 as I am not allowing `multiple` in input:file el. I can't bc SQL connections get exceeded when too many calls in a row.
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(
                    files[i],
                    700,
                    700,
                    'JPEG',
                    100,
                    0,
                    (uri) => { //uri is the base64 image data we get from Resizer
                        axios.post(`${process.env.REACT_APP_API}/images/uploadimage`, {image: uri}, {headers: {'Authorization': `Bearer ${user.usertoken}`}})
                            .then(res => {
                                let uploadedImages = values.images;
                                uploadedImages.push(res.data.image);
                                setValues({...values, images: uploadedImages});
                                setLoader(false);
                            })
                            .catch(error => { //beware. Axios handles responses other than 2xx like this!
                               if (error.response) {
                                setBgColor('#f7dddc');
                                setToastText(error.response.data.error);
                                setShowToast(true);
                                setLoader(false);
                                setTimeout(() => {
                                    setShowToast(false)
                                }, 3000);
                               }
                            })
                    },
                    'base64'
                )
            }
        }
    }



    //REMOVE IMG
    const removeImage = public_id => {

        //only delete from Cloudinary when not editing product
        if (!editingProduct) {
            setLoader(true);
            fetch(`${process.env.REACT_APP_API}/images/removeimage`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.usertoken}`
                },
                method: 'POST',
                body: JSON.stringify({public_id})
            }).then(res => {
                return res.json()
            }).then(data => {
                if (data.error) {
                    setBgColor('#f7dddc');
                    setToastText(data.error);
                    setShowToast(true);
                    setLoader(false);
                    setTimeout(() => {
                        setShowToast(false)
                    }, 3000);
                } else {
                    let imagesArr = values.images;
                    imagesArr = imagesArr.filter(img => img.public_id !== public_id);
                    setValues({...values, images: imagesArr});
                    setBgColor('#aaa');
                    setToastText('Image removed');
                    setShowToast(true);
                    setLoader(false);
                    setTimeout(() => {
                        setShowToast(false)
                    }, 2000);
                }
            }).catch(error => {
                setBgColor('#f7dddc');
                setToastText(JSON.stringify(error));
                setShowToast(true);
                setLoader(false);
                setTimeout(() => {
                    setShowToast(false)
                }, 3000);
            })
        }

        //when editing product, don't delete img from Cloudinary ==> handleSubmit will do it
        else if (editingProduct) {
            let imagesArr = values.images;
            let removed = imagesArr.filter(img => img.public_id === public_id)[0]; //imgs that will be deleted on form submit
            setImagesToDelete([...imagesToDelete, removed]);
            imagesArr = imagesArr.filter(img => img.public_id !== public_id);
            setValues({...values, images: imagesArr});
        }
    }



    //RENDER
    return (
        <React.Fragment>
            {loader && <Spinner animation='border' className='mb-2' />}

            {
                !loader && values.images.length > 0 
                &&
                <div className='img-preview-wrapper'>
                    {values.images.map(img => (
                        <div 
                            className='img-preview' 
                            key={img.public_id} 
                            style={{background: `url(${img.url}) no-repeat center center/cover`}}
                        >
                            <div className='remove-img-btn' onClick={() => removeImage(img.public_id)}>
                                <p>x</p>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {
                values.images.length > 0 && console.log(values.images[0].url)
            }

            <Form.Control 
                type="file"
                /*multiple    - had to turn it off as SQL connections got exceeded when uploading too many imgs in a short time*/
                accept="images/*"
                onChange={resizeAndUpload}
            />
        </React.Fragment>
    )
}

export default FileUpload
