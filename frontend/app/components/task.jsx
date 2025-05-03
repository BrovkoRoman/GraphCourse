import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"
import {toBase64} from "../utils/toBase64.js"

export class Task extends React.Component {
    constructor(props) {
        super(props);
        this.submitTask = this.submitTask.bind(this);
        this.state = {
            submissionFiles: [],
            submissions: []
        };
    }

    async submitTask() {
        console.log("submitTask");

        let submissionId;

        if(this.state.submissions.length > 0 && !this.state.submissions[this.state.submissions.length - 1].checked) {
            submissionId = this.state.submissions[this.state.submissions.length - 1].id;
        } else {
            const response = await fetch(
                "http://localhost:8080/add-submission",
                {
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify({
                        taskId: this.props.task.id,
                        tryId: this.state.submissions.length + 1
                    })
                }
            );
            submissionId = await response.text();
        }

        console.log("submission = " + submissionId);

        const submitTaskInput = document.getElementById("submitTaskInput");
        for(let i = 0; i < submitTaskInput.files.length; i++) {
            const file = submitTaskInput.files[i];
            const fileContent = await toBase64(file);
            const arr = fileContent.split(",");
            const mimeType = arr[0].split(";")[0];
            const addedFile = {
                submissionId: submissionId,
                taskId: this.props.task.id,
                fileName: file.name,
                mimeType: mimeType,
                fileContent: arr[1]
            };

            fetch("http://localhost:8080/add-submission-file",
            {
                headers: {
                  'Content-Type': 'application/json'
                },
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(addedFile)
            })
            .then(response => response.text())
            .then(result => {
                console.log(result);
                this.componentDidMount();
            });
        }
    }

    deleteFile(fileId) {
        fetch("http://localhost:8080/delete-submission-file?fileId=" + fileId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.componentDidMount();
        });
    }

    setScore(submissionId) {
        const score = Number(document.getElementById("setScoreInput_" + submissionId).value);
        if(Number.isNaN(score) || !Number.isInteger(score) || score < 0 || score > this.props.task.maxScore) {
            alert("Баллы должны быть целым числом от 0 до " + this.props.task.maxScore);
            return;
        }
        fetch("http://localhost:8080/set-score",
            {
                headers: {
                  'Content-Type': 'application/json'
                },
                method: "PUT",
                credentials: 'include',
                body: JSON.stringify({
                    submissionId: submissionId,
                    score: score
                })
            })
            .then(response => response.text())
            .then(result => {
                console.log(result);
                this.componentDidMount();
            });
    }

    deleteSubmission(submissionId) {
        fetch("http://localhost:8080/delete-submission?submissionId=" + submissionId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.componentDidMount();
        });
    }

    render() {
        console.log(this.state.submissions);

        if(getCookieValue("role") === "TEACHER") {
            return (<div className="task display-linebreak">
                    <h1>{this.props.task.name}</h1>
                    <b>Условие:&nbsp;</b>
                    {this.props.task.text}<br/>
                    {this.state.submissions.map(submission => {
                            let submissionId = submission.id;
                            return (
                               <div>
                                    <h2>
                                        Попытка № {submission.tryId} от {submission.login}
                                     </h2>
                                    {this.state.submissionFiles.filter(file => file.submissionId == submissionId)
                                    .map(file => (
                                        <div className="content">
                                            <a download={file.fileName}
                                                href={file.mimeType + ";base64," + file.fileContent}>{file.fileName}</a>
                                            <br />
                                        </div>
                                    ))}
                                    <br/>
                                    {submission.checked ? (<div>Оценка: {submission.score}/{this.props.task.maxScore}</div>) : (
                                        <div>
                                            <label htmlFor={"setScoreInput_" + submissionId}>
                                                Поставить баллы&nbsp;
                                            </label>
                                            <input id={"setScoreInput_" + submissionId}
                                            placeholder={"от 0 до " + this.props.task.maxScore} /><br/>
                                            <button onClick={() => this.setScore(submissionId)}>Отправить</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    }
                    </div>
            );
        }

        return (<div className="task display-linebreak">
                    <h1>{this.props.task.name}</h1>
                    <h3>Условие:</h3>
                    <div className="content">{this.props.task.text}</div><br/>
                    {this.state.submissions.map(submission => {
                            let submissionId = submission.id;
                            return (
                               <div>
                                    <h2> Попытка № {submission.tryId}
                                    {submission.checked ? (<div>{submission.score}/{this.props.task.maxScore}</div>)
                                                        : null}</h2>
                                    {this.state.submissionFiles.filter(file => file.submissionId == submissionId)
                                    .map(file => (
                                        <div className="content">
                                            <a download={file.fileName}
                                                href={file.mimeType + ";base64," + file.fileContent}>{file.fileName}</a>
                                            {submission.checked ? null :
                                                (<a className="blackLink"
                                                onClick={() => {this.deleteFile(file.id)}}> &#10006;</a>)}
                                            <br />
                                        </div>
                                    ))}
                                </div>
                            );
                        })
                    }
                    <br/>
                    <label htmlFor="submitTaskInput">Загрузить файлы </label>
                    <input type="file" id="submitTaskInput" multiple/><br/>
                    <button onClick={this.submitTask}>Отправить на проверку</button>
                </div>
               );
    }

    componentDidMount() {
        fetch("http://localhost:8080/user-task-submissions?taskId=" + this.props.task.id,
        {
            method: "GET",
            credentials: 'include'
        })
        .then(response => response.json())
        .then(submissions => {
            if(!!submissions) {
                submissions.sort((a, b) => {
                    if(getCookieValue("role") === "TEACHER") {
                        return a.checked - b.checked;
                    }
                    else {
                        return a.tryId - b.tryId;
                    }
                });

                fetch("http://localhost:8080/user-task-submission-files?taskId=" + this.props.task.id,
                {
                    method: "GET",
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(submissionFiles => {
                    if(!!submissionFiles) {
                        for(let submission of submissions) {
                            if(submissionFiles.filter((file) => (file.submissionId == submission.id)).length == 0) {
                                this.deleteSubmission(submission.id);
                                return;
                            }
                        }

                        this.setState({
                            submissions: submissions,
                            submissionFiles: submissionFiles
                        });
                    }
                })

                this.setState({submissions: submissions});
            }
        })




    }
}