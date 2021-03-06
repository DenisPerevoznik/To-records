
import React, { useState} from 'react';
import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
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
            <MDBModal isOpen={modalState} centered>
                <MDBModalHeader style={{color: record.color}}>
                        {record.title}
                        </MDBModalHeader>
                <MDBModalBody>

                <SunEditor lang="ru" height="300" setOptions={{...params, size: "270"}} 
                    onChange={changeHandler} setContents={record.description}/>


                </MDBModalBody>
                <MDBModalFooter>

                    <button className="btn btn-danger" onClick={onCancel}><i className="fas fa-times"/> Cancel</button>
                    <button className="btn btn-success" onClick={() => {onSave(content)}}><i className="fas fa-check"/> Save</button>
                </MDBModalFooter>
            </MDBModal>
        </>
    );
}