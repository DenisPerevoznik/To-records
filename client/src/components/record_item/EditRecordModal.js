
import React, { useState} from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

export const EditRecordModal = ({record, onSave, onCancel, modalState}) => {

    const [content, setContent] = useState(record.description);

    const changeHandler = (value) => {

        setContent(value);
    }

    const params = {
        imageHeightShow: false,
        imageFileInput: false,
        videoHeightShow: false,
        videoFileInput: false,
        videoRatioShow: false,
        buttonList: [
            [
                "undo",
                "redo",
                "font",
                "fontSize",
                "formatBlock",
                "blockquote",
                "bold",
                "underline",
                "italic",
                "strike",
                "fontColor",
                "hiliteColor",
                "align",
                "horizontalRule",
                "list",
                "lineHeight",
                "table",
                "link",
                "image",
                "video",
                "audio",
                "fullScreen",
                "print",
            ]
        ]
    };

    return (
        <>

            {/* <MDBBtn color="primary" onClick={() => {setModalOpen(true)}} style={btnEdit} title="Edit"><i className="fas fa-pencil-alt"/></MDBBtn> */}

            <MDBModal isOpen={modalState} centered>
                <MDBModalHeader style={{color: record.color}}>
                    {/* <input onChange={changeTitleHandler} className="form-control" 
                        type="text" placeholder="Record title" value={recordData.title}/> */}
                        {record.title}
                        </MDBModalHeader>
                <MDBModalBody>

                <SunEditor lang="ru" height="100" setOptions={{...params, size: "270"}} 
                    onChange={changeHandler} setContents={record.description}/>


                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="default" onClick={() => {onSave(content)}}>Save</MDBBtn>
                    <MDBBtn color="dark" onClick={onCancel}>Cancel</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </>
    );
}

// const btnEdit = {
//     marginTop: "-35px",
//     borderRadius: "50%",
//     borderColor: "white",
//     paddingLeft: "10px",
//     paddingRight: "10px",
//     position: "absolute"
// }