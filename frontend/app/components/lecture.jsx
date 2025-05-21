import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"
import {toBase64} from "../utils/toBase64.js"

export class Lecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lectureTextFields: [],
            lectureImageFields: []
        };
        this.saveLecture = this.saveLecture.bind(this);
        this.addTextField = this.addTextField.bind(this);
        this.addImageField = this.addImageField.bind(this);
    }
    addTextField(fieldIndex) {
        let addedField = {
            lectureId: this.props.lecture.id,
            fieldIndex: fieldIndex,
            content: "текст"
        };
        fetch("http://localhost:8080/new-lecture-text-field",
        {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(addedField)
        })
        .then(response => response.text())
        .then(result => {
            this.componentDidMount();
        })
    }
    addImageField(fieldIndex) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = "image/png, image/jpeg";
        fileInput.onchange = () => {
            const file = fileInput.files[0];
            toBase64(file)
            .then(fileContent => {
                const arr = fileContent.split(",");
                const mimeType = arr[0].split(";")[0];
                fetch("http://localhost:8080/new-lecture-image-field",
                {
                     headers: {
                        "Content-Type": "application/json"
                     },
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify({
                        lectureId: this.props.lecture.id,
                        fieldIndex: fieldIndex,
                        mimeType: mimeType,
                        content: arr[1]
                    })
                })
                .then(response => response.text())
                .then(result => {
                    this.componentDidMount();
                });
            });
        };
        fileInput.click();
    }
    saveTextField(fieldId) {
        const content = document.getElementById("textField_" + fieldId).value;
        fetch("http://localhost:8080/update-lecture-text-field?id=" + fieldId,
        {
            method: "PUT",
            credentials: 'include',
            body: content
        })
        .then(response => response.text())
        .then(result => {
            this.componentDidMount();
        })
    }
    saveLecture() {
        const content = document.getElementById("editor").value;
        fetch("http://localhost:8080/update-lecture?id=" + this.props.lecture.id,
        {
            method: "PUT",
            credentials: 'include',
            body: content
        })
        .then(response => response.text())
        .then(result => {
            this.setState({
                isEdited: false
            });
            this.componentDidMount();
        })
    }

    createUpperIndices(content) {
        const parts = content.split("^");
                let ind = 0;

                return (<span>
                            {parts.map(text => {
                                ind += 1;
                                if(ind % 2 === 1) {
                                    return text;
                                }
                                else {
                                    return (<sup>{text}</sup>);
                                }
                            })}
                        </span>);
    }
    createBold(content) {
        const parts = content.split("**");
        let ind = 0;

        return (<span>
                    {parts.map(text => {
                        ind += 1;
                        if(ind % 2 === 1) {
                            return this.createUpperIndices(text);
                        }
                        else {
                            return (<b>{this.createUpperIndices(text)}</b>);
                        }
                    })}
                </span>);
    }
    createParagraphs(content) {
        const paragraphs = content.split("\n");

        return (<div>
                    {paragraphs.map(text => <p>{this.createBold(text)}</p>)}
                </div>);
    }
    editTextField(fieldId) {
        for(let i = 0; i < this.state.lectureTextFields.length; i++) {
            if(this.state.lectureTextFields[i].id === fieldId) {
                this.setState(state => {
                    state.lectureTextFields[i].isEdited = true;
                    return state;
                });
            }
        }
    }
    deleteTextField(fieldId) {
        fetch("http://localhost:8080/delete-lecture-text-field?id=" + fieldId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            this.componentDidMount();
        });
    }
    deleteImageField(fieldId) {
        fetch("http://localhost:8080/delete-lecture-image-field?id=" + fieldId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            this.componentDidMount();
        });
    }
    insertFieldButtons(fieldIndex) {
        return (<div className="mt5 ml20">
                    <button onClick={() => this.addTextField(fieldIndex)}>Добавить текст</button>
                    <button className="ml20"
                    onClick={() => this.addImageField(fieldIndex)}>Добавить изображение</button>
                </div>);
    }
    render() {
        let textFieldsIndex = 0; // indices in arrays in state
        let imageFieldsIndex = 0;
        let allFields = []; // order of image and text fields in the lecture

        while(textFieldsIndex != this.state.lectureTextFields.length
            || imageFieldsIndex != this.state.lectureImageFields.length) {
            if(textFieldsIndex == this.state.lectureTextFields.length ||
                imageFieldsIndex != this.state.lectureImageFields.length
                && this.state.lectureImageFields[imageFieldsIndex].fieldIndex <
                    this.state.lectureTextFields[textFieldsIndex].fieldIndex) {
                allFields.push('image');
                imageFieldsIndex++;
            } else {
                allFields.push('text');
                textFieldsIndex++;
            }
        }

        imageFieldsIndex = -1;
        textFieldsIndex = -1;
        let curFieldIndex = 0; // for inserting new field before current field

        if(getCookieValue("role") === "TEACHER") {
            return (<div className="lecture">
                        <h1 className="center">{this.props.lecture.name}</h1>
                        {allFields.map(fieldType => {
                            if(fieldType === 'text') {
                                textFieldsIndex++;
                                const field = this.state.lectureTextFields[textFieldsIndex];
                                curFieldIndex = field.fieldIndex;
                                return (field.isEdited ?
                                    (<div>
                                        {this.insertFieldButtons(curFieldIndex)}
                                        <textarea defaultValue={field.content}
                                                  id={"textField_" + field.id}
                                                  className="lectureEditor"/>
                                        <div className="ml5p">
                                            <button onClick={() => this.saveTextField(field.id)}>Сохранить</button>
                                        </div>
                                    </div>)
                                    : (<div>
                                            {this.insertFieldButtons(curFieldIndex)}
                                            {this.createParagraphs(field.content)}
                                            <div className="mt10 ml5p">
                                                <button onClick={() => this.editTextField(field.id)}>Редактировать</button>
                                                <button className="ml20" onClick={() => this.deleteTextField(field.id)}>Удалить</button>
                                            </div>
                                       </div>)
                                    );
                            } else {
                                imageFieldsIndex++;
                                const field = this.state.lectureImageFields[imageFieldsIndex];
                                curFieldIndex = field.fieldIndex;
                                return (<div>
                                            {this.insertFieldButtons(curFieldIndex)}
                                            <div className="center">
                                                <img src={field.mimeType + ";base64," + field.content} className="img"/>
                                                <div>
                                                    <button onClick={() => this.deleteImageField(field.id)}>Удалить</button>
                                                </div>
                                            </div>
                                        </div>);
                            }
                        })}
                        <div className="mt10">
                            {this.insertFieldButtons(curFieldIndex + 1)}
                        </div>
                    </div>);
        } else {
            return (<div className="lecture">
                        <h1 className="center">{this.props.lecture.name}</h1>
                        {allFields.map(fieldType => {
                            if(fieldType === 'text') {
                                textFieldsIndex++;
                                const field = this.state.lectureTextFields[textFieldsIndex];
                                return (<div>
                                            {this.createParagraphs(field.content)}
                                       </div>);
                            } else {
                                imageFieldsIndex++;
                                const field = this.state.lectureImageFields[imageFieldsIndex];
                                return (<div>
                                            <div className="center">
                                                <img src={field.mimeType + ";base64," + field.content} className="img"/>
                                            </div>
                                        </div>);
                            }
                        })}
                    </div>);
        }
    }
    componentDidMount() {
        fetch("http://localhost:8080/get-lecture-text-fields?id=" + this.props.lecture.id)
        .then(response => response.json())
        .then(result => {
            result.sort((a, b) => a.fieldIndex - b.fieldIndex);
            this.setState({
                lectureTextFields: result.map(field => {
                    field.isEdited = false;
                    return field;
                })
            });
        });
        fetch("http://localhost:8080/get-lecture-image-fields?id=" + this.props.lecture.id)
        .then(response => response.json())
        .then(result => {
            result.sort((a, b) => a.fieldIndex - b.fieldIndex);
            this.setState({
                lectureImageFields: result
            });
        });
    }
}